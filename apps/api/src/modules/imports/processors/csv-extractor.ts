import { parse } from 'csv-parse/sync'

import type { CsvExamResult, CsvGestationalRisk, ParsedRecord } from './shared/parsed-record'

const CPF_FIELDS = ['cpf', 'cpf do cidadao', 'cpf cidadao'] as const
const NAME_FIELDS = ['nome', 'name', 'cidadao', 'nome do cidadao', 'nome completo'] as const
const BIRTH_FIELDS = ['data de nascimento', 'data nascimento', 'birth date', 'nascimento'] as const
const MICROAREA_FIELDS = ['microarea', 'micro area'] as const
const PHONE_FIELDS = [
  'telefone celular',
  'telefone residencial',
  'telefone de contato',
  'telefone',
  'celular',
  'phone',
] as const
const ADDRESS_PARTS = ['rua', 'numero', 'complemento', 'bairro', 'municipio', 'uf', 'cep'] as const
const WEIGHT_FIELDS = ['ultima medicao de peso', 'ultima medicao de peso e altura', 'peso'] as const
const HEIGHT_FIELDS = ['ultima medicao de altura', 'altura'] as const
const BP_FIELDS = ['ultima medicao de pressao arterial', 'pressao arterial'] as const
const BP_DATE_FIELDS = [
  'data da ultima medicao de pressao arterial',
  'data da ultima medicao de peso e altura',
] as const
const DAYS_DOCTOR = ['dias desde o ultimo atendimento medico'] as const
const DAYS_NURSING = ['dias desde o ultimo atendimento de enfermagem'] as const
const DAYS_DENTIST = ['dias desde o ultimo atendimento odontologico'] as const
const DAYS_VISIT = ['dias desde a ultima visita domiciliar'] as const
const PRENATAL_COUNT = ['quantidade de atendimentos no pre natal'] as const
const PRENATAL_12W_COUNT = ['quantidade de atendimentos ate 12 semanas no pre natal'] as const
const BP_COUNT = ['quantidade de medicoes de pressao arterial'] as const
const WH_COUNT = ['quantidade de medicoes simultaneas de peso e altura'] as const
const VISIT_COUNT = ['quantidade de visitas domiciliares no pre natal'] as const
const DENTAL_COUNT = ['quantidade de atendimentos odontologicos no pre natal'] as const
const DTPA_FIELDS = ['dtpa'] as const
const HIV1_FIELDS = ['exame de hiv no primeiro trimestre'] as const
const SYPHILIS1_FIELDS = [
  'exame de sifilis no primeiro trimestre)',
  'exame de sifilis no primeiro trimestre',
] as const
const HEPB1_FIELDS = ['exame de hepatite b no primeiro trimestre'] as const
const HEPC1_FIELDS = ['exame de hepatite c no primeiro trimestre'] as const
const HIV3_FIELDS = ['exame de hiv no terceiro trimestre'] as const
const SYPHILIS3_FIELDS = ['exame de sifilis no terceiro trimestre'] as const
const GESTATIONAL_RISK_FIELDS = ['risco gestacional'] as const
const LMP_FIELDS = ['dum'] as const
const GA_WEEKS_FIELDS = ['ig (dum) (semanas)'] as const
const GA_DAYS_FIELDS = ['ig (dum) (dias)'] as const
const EDD_FIELDS = ['dpp (dum)'] as const
const GA_ECO_WEEKS_FIELDS = ['ig (ecografia obstetrica) (semanas)'] as const
const GA_ECO_DAYS_FIELDS = ['ig (ecografia obstetrica) (dias)'] as const
const EDD_ECO_FIELDS = ['dpp (ecografia obstetrica)'] as const
const LAST_PRENATAL_FIELDS = ['ultima consulta de pre natal'] as const

function normalize(key: string): string {
  return key
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isPlaceholder(value: string): boolean {
  const trimmed = value.trim()
  return trimmed === '' || trimmed === '-'
}

function pickField(row: Record<string, string>, candidates: readonly string[]): string {
  const normalized: Record<string, string> = {}
  for (const k of Object.keys(row)) normalized[normalize(k)] = row[k] ?? ''
  for (const c of candidates) {
    const value = normalized[normalize(c)]
    if (value !== undefined && !isPlaceholder(value)) return value
  }
  return ''
}

function parseDate(value: string): Date | undefined {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-') return undefined
  // DD/MM/YYYY
  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) {
    const d = new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T00:00:00Z`)
    return isNaN(d.getTime()) ? undefined : d
  }
  // YYYY-MM-DD ou ISO
  const d = new Date(trimmed.length === 10 ? `${trimmed}T00:00:00Z` : trimmed)
  return isNaN(d.getTime()) ? undefined : d
}

function parseBirthDate(value: string): Date {
  return parseDate(value) ?? new Date(NaN)
}

function parseDecimal(value: string): number | undefined {
  if (isPlaceholder(value)) return undefined
  const cleaned = value.replace(/\s+/g, '').replace(',', '.').replace(/\t/g, '.')
  const num = Number(cleaned)
  return isNaN(num) ? undefined : num
}

function parseInteger(value: string): number | undefined {
  if (isPlaceholder(value)) return undefined
  const num = Number(value.trim())
  return isNaN(num) ? undefined : num
}

/**
 * Mapeia os valores do e-SUS para CsvExamResult:
 * - SIM           → 'negative'       (realizou, resultado negativo)
 * - NAO           → 'not_performed'  (não realizou o exame)
 * - NAO_SE_APLICA → 'not_performed'  (não se aplica ao trimestre)
 * - vazio / '-'   → undefined        (sem informação)
 */
function parseExamResult(raw: string): CsvExamResult | undefined {
  const value = raw.trim().toUpperCase()
  if (!value || value === '-') return undefined
  if (value === 'SIM') return 'negative'
  if (value === 'NAO' || value === 'NÃO') return 'not_performed'
  if (value === 'NAO_SE_APLICA' || value === 'NÃO_SE_APLICA') return 'not_performed'
  return undefined
}

function parseGestationalRisk(raw: string): CsvGestationalRisk | undefined {
  const value = raw.trim().toLowerCase()
  if (!value || value === '-') return undefined
  if (value === 'habitual') return 'habitual'
  if (value.includes('alto')) return 'alto_risco'
  return undefined
}

function parseDtpa(raw: string): boolean | undefined {
  if (isPlaceholder(raw)) return undefined
  return true
}

function detectDelimiter(text: string): ',' | ';' {
  const lines = text.split(/\r?\n/).slice(0, 40)
  let totalCommas = 0
  let totalSemicolons = 0
  for (const line of lines) {
    totalCommas += (line.match(/,/g) ?? []).length
    totalSemicolons += (line.match(/;/g) ?? []).length
  }
  return totalSemicolons > totalCommas ? ';' : ','
}

function findHeaderLine(lines: string[], delimiter: string): number {
  for (let i = 0; i < lines.length; i++) {
    const cells = lines[i].split(delimiter).map((c) => normalize(c.replace(/^"|"$/g, '')))
    const hasName = cells.some((c) => c === 'nome' || c === 'name')
    const hasCpf = cells.some((c) => c === 'cpf' || c.startsWith('cpf '))
    if (hasName && hasCpf) return i
  }
  return 0
}

function composeAddress(row: Record<string, string>): string {
  const parts: string[] = []
  for (const part of ADDRESS_PARTS) {
    const value = pickField(row, [part])
    if (value) parts.push(value)
  }
  return parts.join(', ')
}

export function extractCsvRecords(buffer: Buffer): ParsedRecord[] {
  let text = buffer.toString('utf8').replace(/^\uFEFF/, '')
  if (text.includes('\uFFFD')) {
    text = buffer.toString('latin1').replace(/^\uFEFF/, '')
  }
  const delimiter = detectDelimiter(text)
  const lines = text.split(/\r?\n/)
  const headerIndex = findHeaderLine(lines, delimiter)
  const tableText = lines.slice(headerIndex).join('\n')

  const rows = parse(tableText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    delimiter,
    relax_column_count: true,
    relax_quotes: true,
  }) as Record<string, string>[]

  return rows
    .filter((row) => pickField(row, CPF_FIELDS) !== '')
    .map((row) => {
      const bpDateRaw = pickField(row, BP_DATE_FIELDS)
      const bpDate = bpDateRaw ? parseDate(bpDateRaw) : undefined
      return {
        cpf: pickField(row, CPF_FIELDS),
        name: pickField(row, NAME_FIELDS),
        birthDate: parseBirthDate(pickField(row, BIRTH_FIELDS)),
        address: composeAddress(row),
        phone: pickField(row, PHONE_FIELDS),
        microarea: pickField(row, MICROAREA_FIELDS),
        weight: parseDecimal(pickField(row, WEIGHT_FIELDS)),
        height: parseDecimal(pickField(row, HEIGHT_FIELDS)),
        bloodPressure: pickField(row, BP_FIELDS) || undefined,
        lastMeasurementDate: bpDate,
        daysSinceDoctor: parseInteger(pickField(row, DAYS_DOCTOR)),
        daysSinceNursing: parseInteger(pickField(row, DAYS_NURSING)),
        daysSinceDentist: parseInteger(pickField(row, DAYS_DENTIST)),
        daysSinceHomeVisit: parseInteger(pickField(row, DAYS_VISIT)),
        // Pré-natal
        gestationalRisk: parseGestationalRisk(pickField(row, GESTATIONAL_RISK_FIELDS)),
        lmp: parseDate(pickField(row, LMP_FIELDS)),
        gestationalAgeWeeks: parseInteger(pickField(row, GA_WEEKS_FIELDS)),
        gestationalAgeDays: parseInteger(pickField(row, GA_DAYS_FIELDS)),
        expectedDeliveryDate: parseDate(pickField(row, EDD_FIELDS)),
        gestationalAgeEcoWeeks: parseInteger(pickField(row, GA_ECO_WEEKS_FIELDS)),
        gestationalAgeEcoDays: parseInteger(pickField(row, GA_ECO_DAYS_FIELDS)),
        expectedDeliveryDateEco: parseDate(pickField(row, EDD_ECO_FIELDS)),
        lastPrenatalConsultation: parseDate(pickField(row, LAST_PRENATAL_FIELDS)),
        // Contadores
        prenatalConsultations: parseInteger(pickField(row, PRENATAL_COUNT)),
        consultationsUpTo12Weeks: parseInteger(pickField(row, PRENATAL_12W_COUNT)),
        bloodPressureMeasurements: parseInteger(pickField(row, BP_COUNT)),
        weightHeightMeasurements: parseInteger(pickField(row, WH_COUNT)),
        homeVisits: parseInteger(pickField(row, VISIT_COUNT)),
        dentalAppointments: parseInteger(pickField(row, DENTAL_COUNT)),
        dtpaRegistered: parseDtpa(pickField(row, DTPA_FIELDS)),
        // Exames
        hivExam1stTrimester: parseExamResult(pickField(row, HIV1_FIELDS)),
        syphilisExam1stTrimester: parseExamResult(pickField(row, SYPHILIS1_FIELDS)),
        hepatitisBExam1stTrimester: parseExamResult(pickField(row, HEPB1_FIELDS)),
        hepatitisCExam1stTrimester: parseExamResult(pickField(row, HEPC1_FIELDS)),
        hivExam3rdTrimester: parseExamResult(pickField(row, HIV3_FIELDS)),
        syphilisExam3rdTrimester: parseExamResult(pickField(row, SYPHILIS3_FIELDS)),
      }
    })
}
