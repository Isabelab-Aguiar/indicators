import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../modules/auth/decorators/public.decorator'
import type { AuthenticatedRequest } from '../types/authenticated-request'
import type { TenantContextPayload } from './tenant-context'

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

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
