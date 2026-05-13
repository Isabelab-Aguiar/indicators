import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../../database/database.module'
import { esfs } from '../../database/schema'
import type * as schema from '../../database/schema'
import type { CreateEsfDto } from './dto/create-esf.dto'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class EsfRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(esfs).orderBy(esfs.name)
  }

  findById(id: string) {
    return this.db.query.esfs.findFirst({ where: eq(esfs.id, id) })
  }

  findByCode(code: string) {
    return this.db.query.esfs.findFirst({ where: eq(esfs.code, code) })
  }

  create(dto: CreateEsfDto) {
    return this.db.insert(esfs).values(dto).returning()
  }

  update(id: string, dto: Partial<CreateEsfDto>) {
    return this.db
      .update(esfs)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(esfs.id, id))
      .returning()
  }
}
