import { Body, Controller, Post } from '@nestjs/common'

import { Public } from '../modules/auth/decorators/public.decorator'
import { AccessRequestsService } from './access-requests.service'
import { CreateAccessRequestDto } from './dto/create-access-request.dto'
import type { AccessRequestRecord } from '../database/schema'

@Controller({ path: 'access-requests', version: '1' })
export class AccessRequestsController {
  constructor(private readonly accessRequestsService: AccessRequestsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateAccessRequestDto): Promise<AccessRequestRecord> {
    return this.accessRequestsService.create(dto)
  }
}
