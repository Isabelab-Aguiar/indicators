import { Global, Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { ApiConfigService } from '../config/api-config.service'
import * as schema from './schema'

export const DATABASE_TOKEN = 'DATABASE'

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      useFactory: (config: ApiConfigService) => {
        const pool = new Pool({
          connectionString: config.databaseUrl,
          ssl: { rejectUnauthorized: false },
        })
        return drizzle(pool, { schema })
      },
      inject: [ApiConfigService],
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
