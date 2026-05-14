import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { pregnantWomen } from '../../../../database/schema'
import type * as schema from '../../../../database/schema'
import type { CsvExamResult, ParsedRecord } from './parsed-record'

type Database = NodePgDatabase<typeof schema>

const SUMMED_COUNT_FIELDS = [
  'prenatalConsultations',
  'consultationsUpTo12Weeks',
  'bloodPressureMeasurements',
  'weightHeightMeasurements',
  'homeVisits',
  'dentalAppointments',
] as const

type CountField = (typeof SUMMED_COUNT_FIELDS)[number]

function sumCount(existing: number, incoming: number | undefined): number {
  return existing + (incoming ?? 0)
}

function mergeExam(existing: CsvExamResult, incoming: CsvExamResult | undefined): CsvExamResult {
  if (!incoming) return existing
  if (existing === 'negative' || existing === 'positive') return existing
  return incoming
}

function mergeDtpa(existing: boolean, incoming: boolean | undefined): boolean {
  return existing || (incoming ?? false)
}

export async function upsertPregnantWoman(
  db: Database,
  record: ParsedRecord,
  esfId: string,
  userId: string,
): Promise<void> {
  if (!record.cpf) throw new Error('CPF obrigatório')
  if (!record.name) throw new Error('Nome obrigatório')
  if (!record.birthDate || isNaN(record.birthDate.getTime())) {
    throw new Error('Data de nascimento inválida ou ausente')
  }

  const existing = await db.query.pregnantWomen.findFirst({
    where: and(eq(pregnantWomen.cpf, record.cpf), eq(pregnantWomen.esfId, esfId)),
  })

  const baseValues = {
    esfId,
    cpf: record.cpf,
    name: record.name,
    birthDate: record.birthDate,
    address: record.address || 'Não informado',
    phone: record.phone || '',
    microarea: record.microarea || 'Não informada',
    weight: record.weight?.toString() ?? null,
    height: record.height?.toString() ?? null,
    bloodPressure: record.bloodPressure ?? null,
    lastMeasurementDate: record.lastMeasurementDate ?? null,
    daysSinceDoctor: record.daysSinceDoctor ?? null,
    daysSinceNursing: record.daysSinceNursing ?? null,
    daysSinceDentist: record.daysSinceDentist ?? null,
    daysSinceHomeVisit: record.daysSinceHomeVisit ?? null,
    // Pré-natal — sempre sobrescreve com o valor mais recente do CSV
    gestationalRisk: record.gestationalRisk ?? null,
    lmp: record.lmp ?? null,
    gestationalAgeWeeks: record.gestationalAgeWeeks ?? null,
    gestationalAgeDays: record.gestationalAgeDays ?? null,
    expectedDeliveryDate: record.expectedDeliveryDate ?? null,
    gestationalAgeEcoWeeks: record.gestationalAgeEcoWeeks ?? null,
    gestationalAgeEcoDays: record.gestationalAgeEcoDays ?? null,
    expectedDeliveryDateEco: record.expectedDeliveryDateEco ?? null,
    lastPrenatalConsultation: record.lastPrenatalConsultation ?? null,
    updatedBy: userId,
    updatedAt: new Date(),
  }

  // Fallback 'not_performed': quando o CSV não traz informação do exame,
  // significa que não há registro — não deve ser tratado como 'pendente'.
  const examValues = {
    dtpaRegistered: record.dtpaRegistered ?? false,
    hivExam1stTrimester: record.hivExam1stTrimester ?? 'not_performed',
    syphilisExam1stTrimester: record.syphilisExam1stTrimester ?? 'not_performed',
    hepatitisBExam1stTrimester: record.hepatitisBExam1stTrimester ?? 'not_performed',
    hepatitisCExam1stTrimester: record.hepatitisCExam1stTrimester ?? 'not_performed',
    hivExam3rdTrimester: record.hivExam3rdTrimester ?? 'not_performed',
    syphilisExam3rdTrimester: record.syphilisExam3rdTrimester ?? 'not_performed',
  } as const

  if (existing) {
    const merged: Record<CountField, number> = {
      prenatalConsultations: sumCount(existing.prenatalConsultations, record.prenatalConsultations),
      consultationsUpTo12Weeks: sumCount(
        existing.consultationsUpTo12Weeks,
        record.consultationsUpTo12Weeks,
      ),
      bloodPressureMeasurements: sumCount(
        existing.bloodPressureMeasurements,
        record.bloodPressureMeasurements,
      ),
      weightHeightMeasurements: sumCount(
        existing.weightHeightMeasurements,
        record.weightHeightMeasurements,
      ),
      homeVisits: sumCount(existing.homeVisits, record.homeVisits),
      dentalAppointments: sumCount(existing.dentalAppointments, record.dentalAppointments),
    }

    const mergedExams = {
      dtpaRegistered: mergeDtpa(existing.dtpaRegistered, record.dtpaRegistered),
      hivExam1stTrimester: mergeExam(existing.hivExam1stTrimester, record.hivExam1stTrimester),
      syphilisExam1stTrimester: mergeExam(
        existing.syphilisExam1stTrimester,
        record.syphilisExam1stTrimester,
      ),
      hepatitisBExam1stTrimester: mergeExam(
        existing.hepatitisBExam1stTrimester,
        record.hepatitisBExam1stTrimester,
      ),
      hepatitisCExam1stTrimester: mergeExam(
        existing.hepatitisCExam1stTrimester,
        record.hepatitisCExam1stTrimester,
      ),
      hivExam3rdTrimester: mergeExam(existing.hivExam3rdTrimester, record.hivExam3rdTrimester),
      syphilisExam3rdTrimester: mergeExam(
        existing.syphilisExam3rdTrimester,
        record.syphilisExam3rdTrimester,
      ),
    }

    await db
      .update(pregnantWomen)
      .set({ ...baseValues, ...merged, ...mergedExams })
      .where(eq(pregnantWomen.id, existing.id))
    return
  }

  await db.insert(pregnantWomen).values({
    ...baseValues,
    ...examValues,
    prenatalConsultations: record.prenatalConsultations ?? 0,
    consultationsUpTo12Weeks: record.consultationsUpTo12Weeks ?? 0,
    bloodPressureMeasurements: record.bloodPressureMeasurements ?? 0,
    weightHeightMeasurements: record.weightHeightMeasurements ?? 0,
    homeVisits: record.homeVisits ?? 0,
    dentalAppointments: record.dentalAppointments ?? 0,
  })
}
