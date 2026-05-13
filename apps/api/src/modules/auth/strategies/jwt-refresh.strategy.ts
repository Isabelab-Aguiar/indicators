import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

import { ApiConfigService } from '../../../config/api-config.service'
import type { JwtPayload } from '../../../common/types/authenticated-request'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.['refresh_token'] as string | null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.jwtRefreshSecret,
      passReqToCallback: true,
    })
  }

  validate(request: Request, payload: JwtPayload): JwtPayload & { refreshToken: string } {
    const refreshToken = request.cookies?.['refresh_token'] as string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    return { ...payload, refreshToken }
  }
}
