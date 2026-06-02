import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { IS_PUBLIC_KEY } from '../modules/auth/decorators/public.decorator'
import type { AuthenticatedRequest } from '../common/types/authenticated-request'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const isAdmin = request.user?.role === 'admin'

    if (!isAdmin) throw new ForbiddenException('Acesso restrito a administradores')

    return true
  }
}
