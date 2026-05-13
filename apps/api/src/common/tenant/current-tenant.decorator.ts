import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import type { TenantContextPayload } from './tenant-context'

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantContextPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { tenant: TenantContextPayload }>()
    return request.tenant
  },
)
