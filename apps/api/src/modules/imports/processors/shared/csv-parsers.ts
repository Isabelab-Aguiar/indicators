import type { CsvExamResult, CsvGestationalRisk } from './parsed-record'

export function normalize(key: string): string {
  return key
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isPlaceholder(value: string): boolean {
  const trimmed = value.trim()
  return trimmed === '' || trimmed === '-'
}

export function pickField(row: Record<string, string>, candidates: readonly string[]): string {
  const normalized: Record<string, string> = {}
  for (const k of Object.keys(row)) normalized[normalize(k)] = row[k] ?? ''
  for (const c of candidates) {
    const value = normalized[normalize(c)]
    if (value !== undefined && !isPlaceholder(value)) return value
  }
  return ''
}

export function parseDate(value: string): Date | undefined {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-') return undefined
  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) {
    const d = new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T00:00:00Z`)
    return isNaN(d.getTime()) ? undefined : d
  }
  const d = new Date(trimmed.length === 10 ? `${trimmed}T00:00:00Z` : trimmed)
  return isNaN(d.getTime()) ? undefined : d
}

export function parseBirthDate(value: string): Date {
  return parseDate(value) ?? new Date(NaN)
}

export function parseDecimal(value: string): number | undefined {
  if (isPlaceholder(value)) return undefined
  const cleaned = value.replace(/\s+/g, '').replace(',', '.').replace(/\t/g, '.')
  const num = Number(cleaned)
  return isNaN(num) ? undefined : num
}

export function parseInteger(value: string): number | undefined {
  if (isPlaceholder(value)) return undefined
  const num = Number(value.trim())
  return isNaN(num) ? undefined : num
}

export function parseExamResult(raw: string): CsvExamResult | undefined {
  const value = raw.trim().toUpperCase()
  if (!value || value === '-') return undefined
  if (value === 'SIM') return 'negative'
  if (value === 'NAO' || value === 'NÃO') return 'not_performed'
  if (value === 'NAO_SE_APLICA' || value === 'NÃO_SE_APLICA') return 'not_performed'
  return undefined
}

export function parseGestationalRisk(raw: string): CsvGestationalRisk | undefined {
  const value = raw.trim().toLowerCase()
  if (!value || value === '-') return undefined
  if (value === 'habitual') return 'habitual'
  if (value.includes('alto')) return 'alto_risco'
  return undefined
}

export function parseDtpa(raw: string): boolean | undefined {
  if (isPlaceholder(raw)) return undefined
  return true
}
