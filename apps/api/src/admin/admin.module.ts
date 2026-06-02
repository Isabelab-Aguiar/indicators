import { Module, forwardRef } from '@nestjs/common'

import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminGuard } from './admin.guard'
import { AdminRepository } from './admin.repository'
import { UsersModule } from '../modules/users/users.module'

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, AdminGuard],
})
export class AdminModule {}
