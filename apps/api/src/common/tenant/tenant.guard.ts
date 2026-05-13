import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import type { AuthenticatedRequest } from '../types/authenticated-request'
import type { TenantContextPayload } from './tenant-context'

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest & { tenant: TenantContextPayload }>()

    const user = request.user

    if (!user?.esfId) {
      throw new ForbiddenException('Tenant context not found')
    }

    request.tenant = {
      esfId: user.esfId,
      esfName: user.esfName,
      esfCode: user.esfCode,
      userId: user.id,
      userRole: user.role,
      isAdmin: user.role === 'admin',
    }

    return true
  }
}
