import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'

import { DatabaseModule } from './database/database.module'
import { ConfigModule } from './config/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { EsfModule } from './modules/esf/esf.module'
import { PregnantWomenModule } from './modules/pregnant-women/pregnant-women.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ImportsModule } from './modules/imports/imports.module'
import { AuditModule } from './modules/audit/audit.module'
import { HealthModule } from './modules/health/health.module'
import { StorageModule } from './modules/storage/storage.module'
import { C1Module } from './modules/c1/c1.module'
import { C7Module } from './modules/c7/c7.module'
import { RATE_LIMIT } from '@repo/config'

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: RATE_LIMIT.GLOBAL_WINDOW_MS,
        limit: RATE_LIMIT.GLOBAL_MAX_REQUESTS,
      },
    ]),
    DatabaseModule,
    StorageModule,
    AuditModule,
    AuthModule,
    UsersModule,
    EsfModule,
    PregnantWomenModule,
    DashboardModule,
    ImportsModule,
    C1Module,
    C7Module,
    HealthModule,
  ],
})
export class AppModule {}
