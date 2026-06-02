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
import { C2Module } from './modules/c2/c2.module'
import { C4Module } from './modules/c4/c4.module'
import { C5Module } from './modules/c5/c5.module'
import { C6Module } from './modules/c6/c6.module'
import { C7Module } from './modules/c7/c7.module'
import { AdminModule } from './admin/admin.module'
import { AccessRequestsModule } from './access-requests/access-requests.module'
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
    C2Module,
    C4Module,
    C5Module,
    C6Module,
    C7Module,
    HealthModule,
    AdminModule,
    AccessRequestsModule,
  ],
})
export class AppModule {}
