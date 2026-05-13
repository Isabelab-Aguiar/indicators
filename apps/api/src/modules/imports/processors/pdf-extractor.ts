import type { ParsedRecord } from './shared/parsed-record'

interface PositionedText {
  str: string
  x: number
  y: number
}

interface LineGroup {
  y: number
  items: PositionedText[]
  text: string
}

const Y_TOLERANCE = 2.5
const CPF_REGEX = /CPF:\s*(\d{3}\.\d{3}\.\d{3}-\d{2})/
const BIRTH_REGEX = /(\d{2})\/(\d{2})\/(\d{4})/
const PHONE_REGEX = /\((\d{2})\)\s?(\d{4,5})-?(\d{4})/
const CEP_REGEX = /\d{5}-\d{3}/
const MICROAREA_REGEX = /Microárea:\s*([^|\n]+?)\s*$/i
const PESO_REGEX = /Peso\/Altura:\s*([\d,]+)\s*kg\/([\d,]+)\s*cm(?:\s*em\s*(\d{2}\/\d{2}\/\d{4}))?/i
const PA_REGEX = /P\.?A\.?:\s*(\d{2,3}\/\d{2,3})\s*mmHg(?:\s*em\s*(\d{2}\/\d{2}\/\d{4}))?/i
const DAYS_REGEX = /(?:Há\s*)?(?:(\d+)\s*meses?(?:\s*e\s*(\d+)\s*dias?)?|(\d+)\s*dias?)/i
const SKIP_LINE_PATTERNS = [
  /^MINISTÉRIO DA SAÚDE/i,
  /^ESTADO DE/i,
  /^MUNICÍPIO DE/i,
  /^UNIDADE DE SAÚDE/i,
  /^FILTROS:/i,
  /^ACOMPANHAMENTO DE CONDIÇÕES/i,
  /^Equipe:/i,
  /^Identificação\s+Endereço/i,
  /^Total de pessoas/i,
  /^Os dados podem/i,
  /^O resultado pode/i,
  /^Impresso em/i,
]

function isSkippable(text: string): boolean {
  return SKIP_LINE_PATTERNS.some((re) => re.test(text))
}

function groupLines(items: PositionedText[]): LineGroup[] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
  const lines: LineGroup[] = []
  for (const item of sorted) {
    const last = lines[lines.length - 1]
    if (last && Math.abs(last.y - item.y) < Y_TOLERANCE) {
      last.items.push(item)
    } else {
      lines.push({ y: item.y, items: [item], text: '' })
    }
  }
  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x)
    line.text = line.items
      .map((i) => i.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return lines
}

function parseDays(text: string): number | undefined {
  if (!text || text.includes(': -') || text.trim().endsWith(':')) return undefined
  const match = text.match(DAYS_REGEX)
  if (!match) return undefined
  const months = match[1] ? Number(match[1]) : 0
  const daysFromMonths = match[2] ? Number(match[2]) : 0
  const daysOnly = match[3] ? Number(match[3]) : 0
  return months * 30 + daysFromMonths + daysOnly
}

function parseBrazilianDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const match = value.match(BIRTH_REGEX)
  if (!match) return undefined
  return new Date(`${match[3]}-${match[2]}-${match[1]}T00:00:00Z`)
}

function extractName(identificationText: string): string {
  const cpfIndex = identificationText.search(CPF_REGEX)
  const beforeCpf = cpfIndex > 0 ? identificationText.slice(0, cpfIndex) : identificationText
  const ageMatch = beforeCpf.match(/\d+\s*anos?/i)
  const namePart = ageMatch ? beforeCpf.slice(0, ageMatch.index) : beforeCpf
  return namePart.replace(/\s+/g, ' ').trim()
}

function buildRecord(lines: LineGroup[], microarea: string): ParsedRecord | null {
  const fullText = lines.map((l) => l.text).join(' ')
  const cpfMatch = fullText.match(CPF_REGEX)
  if (!cpfMatch) return null

  const identificationLine = lines.find((l) => CPF_REGEX.test(l.text))?.text ?? ''
  const addressLine =
    lines.find((l) => CEP_REGEX.test(l.text) && !CPF_REGEX.test(l.text))?.text ?? ''
  const attendancesText = lines.find((l) => /Médico:/i.test(l.text))?.text ?? ''
  const measurementsText = lines.find((l) => /Peso\/Altura|P\.?A\.?:/i.test(l.text))?.text ?? ''

  const cpf = cpfMatch[1]
  const name = extractName(identificationLine)
  const birthMatch = identificationLine.match(BIRTH_REGEX)
  const birthDate = parseBrazilianDate(birthMatch?.[0]) ?? new Date(NaN)
  const phoneMatch = identificationLine.match(PHONE_REGEX)
  const phone = phoneMatch ? `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}` : ''

  const pesoMatch = measurementsText.match(PESO_REGEX)
  const paMatch = measurementsText.match(PA_REGEX)
  const measurementDateStr = pesoMatch?.[3] ?? paMatch?.[2]

  const segments = attendancesText.split(
    /(?=Médico:|Enfermagem:|Odontológico:|Visita domiciliar:)/i,
  )
  const findSeg = (label: string) =>
    segments.find((s) => new RegExp(`^${label}:`, 'i').test(s)) ?? ''

  return {
    cpf,
    name,
    birthDate,
    address: addressLine,
    phone,
    microarea,
    weight: pesoMatch ? Number(pesoMatch[1].replace(',', '.')) : undefined,
    height: pesoMatch ? Number(pesoMatch[2].replace(',', '.')) : undefined,
    bloodPressure: paMatch ? paMatch[1] : undefined,
    lastMeasurementDate: parseBrazilianDate(measurementDateStr),
    daysSinceDoctor: parseDays(findSeg('Médico')),
    daysSinceNursing: parseDays(findSeg('Enfermagem')),
    daysSinceDentist: parseDays(findSeg('Odontológico')),
    daysSinceHomeVisit: parseDays(findSeg('Visita domiciliar')),
  }
}

export async function extractPdfRecords(buffer: Buffer): Promise<ParsedRecord[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise

  const records: ParsedRecord[] = []
  let microarea = 'Não informada'

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    const items: PositionedText[] = content.items.flatMap((raw) => {
      if (!('str' in raw) || !('transform' in raw)) return []
      const str = raw.str
      if (!str || !str.trim()) return []
      return [{ str, x: raw.transform[4], y: raw.transform[5] }]
    })

    const lines = groupLines(items).filter((l) => !isSkippable(l.text))

    let buffer: LineGroup[] = []
    for (const line of lines) {
      const microMatch = line.text.match(MICROAREA_REGEX)
      if (microMatch) {
        if (buffer.length > 0) {
          const rec = buildRecord(buffer, microarea)
          if (rec) records.push(rec)
          buffer = []
        }
        microarea = microMatch[1].trim()
        continue
      }

      if (CPF_REGEX.test(line.text) && buffer.length > 0) {
        const rec = buildRecord(buffer, microarea)
        if (rec) records.push(rec)
        buffer = []
      }
      buffer.push(line)
    }

    if (buffer.length > 0) {
      const rec = buildRecord(buffer, microarea)
      if (rec) records.push(rec)
    }
  }

  return records
}
