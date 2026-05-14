import type { ParsedRecord } from './shared/parsed-record'
import {
  pickField,
  parseDate,
  parseBirthDate,
  parseDecimal,
  parseInteger,
  parseExamResult,
  parseGestationalRisk,
  parseDtpa,
} from './shared/csv-parsers'
import {
  detectDelimiter,
  findHeaderLine,
  composeAddress,
  decodeCsvText,
  parseCsvRows,
} from './shared/csv-utils'
import {
  CPF_FIELDS,
  NAME_FIELDS,
  BIRTH_FIELDS,
  MICROAREA_FIELDS,
  PHONE_FIELDS,
  WEIGHT_FIELDS,
  HEIGHT_FIELDS,
  BP_FIELDS,
  BP_DATE_FIELDS,
  DAYS_DOCTOR,
  DAYS_NURSING,
  DAYS_DENTIST,
  DAYS_VISIT,
  PRENATAL_COUNT,
  PRENATAL_12W_COUNT,
  BP_COUNT,
  WH_COUNT,
  VISIT_COUNT,
  DENTAL_COUNT,
  DTPA_FIELDS,
  HIV1_FIELDS,
  SYPHILIS1_FIELDS,
  HEPB1_FIELDS,
  HEPC1_FIELDS,
  HIV3_FIELDS,
  SYPHILIS3_FIELDS,
  GESTATIONAL_RISK_FIELDS,
  LMP_FIELDS,
  GA_WEEKS_FIELDS,
  GA_DAYS_FIELDS,
  EDD_FIELDS,
  GA_ECO_WEEKS_FIELDS,
  GA_ECO_DAYS_FIELDS,
  EDD_ECO_FIELDS,
  LAST_PRENATAL_FIELDS,
} from './shared/csv-fields'

function mapRowToRecord(row: Record<string, string>): ParsedRecord {
  const bpDateRaw = pickField(row, BP_DATE_FIELDS)
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
    lastMeasurementDate: bpDateRaw ? parseDate(bpDateRaw) : undefined,
    daysSinceDoctor: parseInteger(pickField(row, DAYS_DOCTOR)),
    daysSinceNursing: parseInteger(pickField(row, DAYS_NURSING)),
    daysSinceDentist: parseInteger(pickField(row, DAYS_DENTIST)),
    daysSinceHomeVisit: parseInteger(pickField(row, DAYS_VISIT)),
    gestationalRisk: parseGestationalRisk(pickField(row, GESTATIONAL_RISK_FIELDS)),
    lmp: parseDate(pickField(row, LMP_FIELDS)),
    gestationalAgeWeeks: parseInteger(pickField(row, GA_WEEKS_FIELDS)),
    gestationalAgeDays: parseInteger(pickField(row, GA_DAYS_FIELDS)),
    expectedDeliveryDate: parseDate(pickField(row, EDD_FIELDS)),
    gestationalAgeEcoWeeks: parseInteger(pickField(row, GA_ECO_WEEKS_FIELDS)),
    gestationalAgeEcoDays: parseInteger(pickField(row, GA_ECO_DAYS_FIELDS)),
    expectedDeliveryDateEco: parseDate(pickField(row, EDD_ECO_FIELDS)),
    lastPrenatalConsultation: parseDate(pickField(row, LAST_PRENATAL_FIELDS)),
    prenatalConsultations: parseInteger(pickField(row, PRENATAL_COUNT)),
    consultationsUpTo12Weeks: parseInteger(pickField(row, PRENATAL_12W_COUNT)),
    bloodPressureMeasurements: parseInteger(pickField(row, BP_COUNT)),
    weightHeightMeasurements: parseInteger(pickField(row, WH_COUNT)),
    homeVisits: parseInteger(pickField(row, VISIT_COUNT)),
    dentalAppointments: parseInteger(pickField(row, DENTAL_COUNT)),
    dtpaRegistered: parseDtpa(pickField(row, DTPA_FIELDS)),
    hivExam1stTrimester: parseExamResult(pickField(row, HIV1_FIELDS)),
    syphilisExam1stTrimester: parseExamResult(pickField(row, SYPHILIS1_FIELDS)),
    hepatitisBExam1stTrimester: parseExamResult(pickField(row, HEPB1_FIELDS)),
    hepatitisCExam1stTrimester: parseExamResult(pickField(row, HEPC1_FIELDS)),
    hivExam3rdTrimester: parseExamResult(pickField(row, HIV3_FIELDS)),
    syphilisExam3rdTrimester: parseExamResult(pickField(row, SYPHILIS3_FIELDS)),
  }
}

export function extractCsvRecords(buffer: Buffer): ParsedRecord[] {
  const text = decodeCsvText(buffer)
  const delimiter = detectDelimiter(text)
  const lines = text.split(/\r?\n/)
  const headerIndex = findHeaderLine(lines, delimiter)
  const tableText = lines.slice(headerIndex).join('\n')
  const rows = parseCsvRows(tableText, delimiter)
  return rows.filter((row) => pickField(row, CPF_FIELDS) !== '').map(mapRowToRecord)
}
