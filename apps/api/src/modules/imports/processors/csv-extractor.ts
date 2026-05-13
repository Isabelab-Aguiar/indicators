import { parse } from 'csv-parse/sync'

import type { ParsedRecord } from './shared/parsed-record'

const CPF_FIELDS = ['cpf', 'cpf do cidadao', 'cpf cidadao'] as const
const NAME_FIELDS = ['nome', 'name', 'cidadao', 'nome do cidadao', 'nome completo'] as const
const BIRTH_FIELDS = ['data nascimento', 'birth date', 'data de nascimento', 'nascimento'] as const
const ADDRESS_FIELDS = ['endereco', 'address', 'endereco completo', 'logradouro'] as const
const PHONE_FIELDS = ['telefone', 'phone', 'telefones', 'celular', 'telefone(s)'] as const
const MICROAREA_FIELDS = ['microarea', 'micro area'] as const

function normalize(key: string): string {
  return key
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickField(row: Record<string, string>, candidates: readonly string[]): string {
  const normalized: Record<string, string> = {}
  for (const k of Object.keys(row)) normalized[normalize(k)] = row[k] ?? ''
  for (const c of candidates) {
    const value = normalized[normalize(c)]
    if (value !== undefined && value !== '') return value
  }
  return ''
}

function parseBirthDate(value: string): Date {
  const trimmed = value.trim()
  if (!trimmed) return new Date(NaN)
  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (brMatch) return new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T00:00:00Z`)
  return new Date(trimmed)
}

function detectDelimiter(buffer: Buffer): ',' | ';' {
  const firstLine = buffer.toString('utf8', 0, 4096).split(/\r?\n/)[0] ?? ''
  const commas = (firstLine.match(/,/g) ?? []).length
  const semicolons = (firstLine.match(/;/g) ?? []).length
  return semicolons > commas ? ';' : ','
}

export function extractCsvRecords(buffer: Buffer): ParsedRecord[] {
  const delimiter = detectDelimiter(buffer)
  const rows = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    delimiter,
    relax_column_count: true,
    relax_quotes: true,
  }) as Record<string, string>[]

  return rows.map((row) => ({
    cpf: pickField(row, CPF_FIELDS),
    name: pickField(row, NAME_FIELDS),
    birthDate: parseBirthDate(pickField(row, BIRTH_FIELDS)),
    address: pickField(row, ADDRESS_FIELDS),
    phone: pickField(row, PHONE_FIELDS),
    microarea: pickField(row, MICROAREA_FIELDS),
  }))
}
