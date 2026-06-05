import { Inject, Injectable } from '@nestjs/common'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DATABASE_TOKEN } from '../database/database.module'
import { accessRequests } from '../database/schema'
import type * as schema from '../database/schema'
import type { AccessRequestRecord } from '../database/schema'
import type { CreateAccessRequestDto } from './dto/create-access-request.dto'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class AccessRequestsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async create(dto: CreateAccessRequestDto): Promise<AccessRequestRecord> {
    const [record] = await this.db
      .insert(accessRequests)
      .values({
        name: dto.name,
        email: dto.email.toLowerCase(),
        cpf: dto.cpf,
        role: dto.role as 'admin' | 'manager' | 'nurse' | 'doctor' | 'acs',
        esfId: dto.esfId ?? null,
        esfName: dto.esfName,
        cnes: dto.cnes,
        message: dto.message,
        status: 'pending',
      })
      .returning()

    return record
  }
}
