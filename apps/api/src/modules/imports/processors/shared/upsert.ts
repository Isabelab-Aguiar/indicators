import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { pregnantWomen } from '../../../../database/schema'
import type * as schema from '../../../../database/schema'
import type { ParsedRecord } from './parsed-record'

type Database = NodePgDatabase<typeof schema>

function pickNumber(incoming: number | undefined, existing: number): number {
  return incoming ?? existing
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

  const examValues = {
    dtpaRegistered: record.dtpaRegistered ?? existing?.dtpaRegistered ?? false,
    hivExam1stTrimester:
      record.hivExam1stTrimester ?? existing?.hivExam1stTrimester ?? 'not_performed',
    syphilisExam1stTrimester:
      record.syphilisExam1stTrimester ?? existing?.syphilisExam1stTrimester ?? 'not_performed',
    hepatitisBExam1stTrimester:
      record.hepatitisBExam1stTrimester ?? existing?.hepatitisBExam1stTrimester ?? 'not_performed',
    hepatitisCExam1stTrimester:
      record.hepatitisCExam1stTrimester ?? existing?.hepatitisCExam1stTrimester ?? 'not_performed',
    hivExam3rdTrimester:
      record.hivExam3rdTrimester ?? existing?.hivExam3rdTrimester ?? 'not_performed',
    syphilisExam3rdTrimester:
      record.syphilisExam3rdTrimester ?? existing?.syphilisExam3rdTrimester ?? 'not_performed',
  } as const

  const counters = existing
    ? {
        prenatalConsultations: pickNumber(
          record.prenatalConsultations,
          existing.prenatalConsultations,
        ),
        consultationsUpTo12Weeks: pickNumber(
          record.consultationsUpTo12Weeks,
          existing.consultationsUpTo12Weeks,
        ),
        bloodPressureMeasurements: pickNumber(
          record.bloodPressureMeasurements,
          existing.bloodPressureMeasurements,
        ),
        weightHeightMeasurements: pickNumber(
          record.weightHeightMeasurements,
          existing.weightHeightMeasurements,
        ),
        homeVisits: pickNumber(record.homeVisits, existing.homeVisits),
        dentalAppointments: pickNumber(record.dentalAppointments, existing.dentalAppointments),
      }
    : {
        prenatalConsultations: record.prenatalConsultations ?? 0,
        consultationsUpTo12Weeks: record.consultationsUpTo12Weeks ?? 0,
        bloodPressureMeasurements: record.bloodPressureMeasurements ?? 0,
        weightHeightMeasurements: record.weightHeightMeasurements ?? 0,
        homeVisits: record.homeVisits ?? 0,
        dentalAppointments: record.dentalAppointments ?? 0,
      }

  if (existing) {
    await db
      .update(pregnantWomen)
      .set({ ...baseValues, ...counters, ...examValues })
      .where(eq(pregnantWomen.id, existing.id))
    return
  }

  await db.insert(pregnantWomen).values({ ...baseValues, ...counters, ...examValues })
}
