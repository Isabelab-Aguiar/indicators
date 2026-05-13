import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { pregnantWomen } from '../../../../database/schema'
import type * as schema from '../../../../database/schema'
import type { ParsedRecord } from './parsed-record'

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
    updatedBy: userId,
    updatedAt: new Date(),
  }

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
    await db
      .update(pregnantWomen)
      .set({ ...baseValues, ...merged })
      .where(eq(pregnantWomen.id, existing.id))
    return
  }

  await db.insert(pregnantWomen).values({
    ...baseValues,
    prenatalConsultations: record.prenatalConsultations ?? 0,
    consultationsUpTo12Weeks: record.consultationsUpTo12Weeks ?? 0,
    bloodPressureMeasurements: record.bloodPressureMeasurements ?? 0,
    weightHeightMeasurements: record.weightHeightMeasurements ?? 0,
    homeVisits: record.homeVisits ?? 0,
    dentalAppointments: record.dentalAppointments ?? 0,
  })
}
