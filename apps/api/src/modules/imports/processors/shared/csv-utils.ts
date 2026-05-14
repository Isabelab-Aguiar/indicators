import { parse } from 'csv-parse/sync'

import { normalize, pickField } from './csv-parsers'
import { ADDRESS_PARTS } from './csv-fields'

export function detectDelimiter(text: string): ',' | ';' {
  const lines = text.split(/\r?\n/).slice(0, 40)
  let totalCommas = 0
  let totalSemicolons = 0
  for (const line of lines) {
    totalCommas += (line.match(/,/g) ?? []).length
    totalSemicolons += (line.match(/;/g) ?? []).length
  }
  return totalSemicolons > totalCommas ? ';' : ','
}

export function findHeaderLine(lines: string[], delimiter: string): number {
  for (let i = 0; i < lines.length; i++) {
    const cells = lines[i].split(delimiter).map((c) => normalize(c.replace(/^"|"$/g, '')))
    const hasName = cells.some((c) => c === 'nome' || c === 'name')
    const hasCpf = cells.some((c) => c === 'cpf' || c.startsWith('cpf '))
    if (hasName && hasCpf) return i
  }
  return 0
}

export function composeAddress(row: Record<string, string>): string {
  const parts: string[] = []
  for (const part of ADDRESS_PARTS) {
    const value = pickField(row, [part])
    if (value) parts.push(value)
  }
  return parts.join(', ')
}

export function decodeCsvText(buffer: Buffer): string {
  const utf8 = buffer.toString('utf8').replace(/^\uFEFF/, '')
  if (utf8.includes('\uFFFD')) return buffer.toString('latin1').replace(/^\uFEFF/, '')
  return utf8
}

export function parseCsvRows(text: string, delimiter: string): Record<string, string>[] {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    delimiter,
    relax_column_count: true,
    relax_quotes: true,
  }) as Record<string, string>[]
}
