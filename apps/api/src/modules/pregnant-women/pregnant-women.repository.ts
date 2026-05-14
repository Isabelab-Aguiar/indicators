import { Inject, Injectable } from '@nestjs/common'
import { and, asc, count, desc, eq, ilike, or, SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { pregnantWomen } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { CreatePregnantWomanDto } from './dto/create-pregnant-woman.dto'
import type { PregnantWomanFiltersDto } from './dto/pregnant-woman-filters.dto'
import type { NewPregnantWomanRecord } from '../../database/schema'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class PregnantWomenRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll(esfId: string, filters: PregnantWomanFiltersDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      search,
      microarea,
      bloodPressureStatus,
    } = filters

    const conditions: SQL[] = [eq(pregnantWomen.esfId, esfId)]

    if (search) {
      conditions.push(
        or(ilike(pregnantWomen.name, `%${search}%`), ilike(pregnantWomen.cpf, `%${search}%`))!,
      )
    }
    if (microarea) conditions.push(eq(pregnantWomen.microarea, microarea))
    if (bloodPressureStatus) {
      conditions.push(
        eq(
          pregnantWomen.bloodPressureStatus,
          bloodPressureStatus as 'normal' | 'elevated' | 'high' | 'critical',
        ),
      )
    }

    const where = and(...conditions)
    const orderFn = sortOrder === 'desc' ? desc : asc
    const column = pregnantWomen[sortBy as keyof typeof pregnantWomen] ?? pregnantWomen.name

    const [{ total }] = await this.db.select({ total: count() }).from(pregnantWomen).where(where)

    const data = await this.db
      .select()
      .from(pregnantWomen)
      .where(where)
      .orderBy(orderFn(column as Parameters<typeof asc>[0]))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    return {
      data,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    }
  }

  findById(id: string, esfId: string) {
    return this.db.query.pregnantWomen.findFirst({
      where: and(eq(pregnantWomen.id, id), eq(pregnantWomen.esfId, esfId)),
    })
  }

  findByCpfAndEsf(cpf: string, esfId: string) {
    return this.db.query.pregnantWomen.findFirst({
      where: and(eq(pregnantWomen.cpf, cpf), eq(pregnantWomen.esfId, esfId)),
    })
  }

  create(dto: CreatePregnantWomanDto & { esfId: string; updatedBy: string }) {
    const record: NewPregnantWomanRecord = {
      ...dto,
      birthDate: new Date(dto.birthDate),
      lastMeasurementDate: dto.lastMeasurementDate ? new Date(dto.lastMeasurementDate) : undefined,
      interruptionDate: dto.interruptionDate ? new Date(dto.interruptionDate) : undefined,
      weight: dto.weight != null ? String(dto.weight) : undefined,
      height: dto.height != null ? String(dto.height) : undefined,
    }
    return this.db.insert(pregnantWomen).values(record).returning()
  }

  update(id: string, esfId: string, dto: Partial<CreatePregnantWomanDto> & { updatedBy: string }) {
    const { birthDate, lastMeasurementDate, interruptionDate, weight, height, ...rest } = dto
    const patch: Partial<NewPregnantWomanRecord> = {
      ...rest,
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
      ...(lastMeasurementDate ? { lastMeasurementDate: new Date(lastMeasurementDate) } : {}),
      ...(interruptionDate ? { interruptionDate: new Date(interruptionDate) } : {}),
      ...(weight != null ? { weight: String(weight) } : {}),
      ...(height != null ? { height: String(height) } : {}),
      updatedAt: new Date(),
    }
    return this.db
      .update(pregnantWomen)
      .set(patch)
      .where(and(eq(pregnantWomen.id, id), eq(pregnantWomen.esfId, esfId)))
      .returning()
  }

  delete(id: string, esfId: string) {
    return this.db
      .delete(pregnantWomen)
      .where(and(eq(pregnantWomen.id, id), eq(pregnantWomen.esfId, esfId)))
  }

  deleteAllByEsf(esfId: string) {
    return this.db.delete(pregnantWomen).where(eq(pregnantWomen.esfId, esfId))
  }
}
