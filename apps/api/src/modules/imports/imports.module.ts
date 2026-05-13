import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'

import { ImportsController } from './imports.controller'
import { ImportsService } from './imports.service'
import { CsvImportProcessor } from './processors/csv-import.processor'
import { ApiConfigService } from '../../config/api-config.service'
import { QUEUE_NAMES } from '@repo/config'

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: ApiConfigService) => {
        const url = config.redisUrl
        const isTls = url.startsWith('rediss://')
        return {
          connection: {
            url,
            ...(isTls && { tls: { rejectUnauthorized: false } }),
          },
        }
      },
      inject: [ApiConfigService],
    }),
    BullModule.registerQueue({ name: QUEUE_NAMES.IMPORT }),
  ],
  controllers: [ImportsController],
  providers: [ImportsService, CsvImportProcessor],
})
export class ImportsModule {}
