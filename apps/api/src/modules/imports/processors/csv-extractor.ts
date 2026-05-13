import { parse } from 'csv-parse/sync'

import type { ParsedRecord } from './shared/parsed-record'

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
const WEIGHT_FIELDS = ['ultima medicao de peso', 'peso'] as const
const HEIGHT_FIELDS = ['ultima medicao de altura', 'altura'] as const
const BP_FIELDS = ['ultima medicao de pressao arterial', 'pressao arterial'] as const
const BP_DATE_FIELDS = ['data da ultima medicao de pressao arterial'] as const
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
    if (value && !isPlaceholder(value)) return value
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

function detectDelimiter(text: string): ',' | ';' {
  const firstLine = text.split(/\r?\n/)[0] ?? ''
  const commas = (firstLine.match(/,/g) ?? []).length
  const semicolons = (firstLine.match(/;/g) ?? []).length
  return semicolons > commas ? ';' : ','
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
  const text = buffer.toString('utf8').replace(/^﻿/, '')
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
      const bpDate = bpDateRaw ? parseBirthDate(bpDateRaw) : undefined
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
        lastMeasurementDate: bpDate && !isNaN(bpDate.getTime()) ? bpDate : undefined,
        daysSinceDoctor: parseInteger(pickField(row, DAYS_DOCTOR)),
        daysSinceNursing: parseInteger(pickField(row, DAYS_NURSING)),
        daysSinceDentist: parseInteger(pickField(row, DAYS_DENTIST)),
        daysSinceHomeVisit: parseInteger(pickField(row, DAYS_VISIT)),
        prenatalConsultations: parseInteger(pickField(row, PRENATAL_COUNT)),
        consultationsUpTo12Weeks: parseInteger(pickField(row, PRENATAL_12W_COUNT)),
        bloodPressureMeasurements: parseInteger(pickField(row, BP_COUNT)),
        weightHeightMeasurements: parseInteger(pickField(row, WH_COUNT)),
        homeVisits: parseInteger(pickField(row, VISIT_COUNT)),
        dentalAppointments: parseInteger(pickField(row, DENTAL_COUNT)),
      }
    })
}
