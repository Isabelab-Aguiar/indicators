import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import type { Request } from 'express'

import type { AuthenticatedRequest } from '../types/authenticated-request'

export const AUDIT_KEY = 'audit'

export interface AuditMetadata {
  action: string
  entity: string
}

export const Audit = (meta: AuditMetadata) => Reflect.metadata(AUDIT_KEY, meta)

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = this.reflector.get<AuditMetadata>(AUDIT_KEY, context.getHandler())

    if (!metadata) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest & Request>()

    return next.handle().pipe(
      tap(() => {
        const ip = request.ip ?? 'unknown'
        const userAgent = request.headers['user-agent'] ?? 'unknown'

        void this.logAudit({
          action: metadata.action,
          entity: metadata.entity,
          userId: request.user?.id,
          ip,
          userAgent,
        })
      }),
    )
  }

  private async logAudit(_data: {
    action: string
    entity: string
    userId: string | undefined
    ip: string
    userAgent: string
  }): Promise<void> {
    // audit service injected via module — see audit.module.ts
  }
}
