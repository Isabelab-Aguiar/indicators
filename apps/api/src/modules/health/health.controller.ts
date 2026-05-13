import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { ApiTags } from '@nestjs/swagger'

import { Public } from '../auth/decorators/public.decorator'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([])
  }
}
