import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { pregnantWomen } from '../../../../database/schema'
import type * as schema from '../../../../database/schema'
import type { ParsedRecord } from './parsed-record'

type Database = NodePgDatabase<typeof schema>

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

  const values = {
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

  const existing = await db.query.pregnantWomen.findFirst({
    where: and(eq(pregnantWomen.cpf, record.cpf), eq(pregnantWomen.esfId, esfId)),
  })

  if (existing) {
    await db.update(pregnantWomen).set(values).where(eq(pregnantWomen.id, existing.id))
  } else {
    await db.insert(pregnantWomen).values(values)
  }
}
