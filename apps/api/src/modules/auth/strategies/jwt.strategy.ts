import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { ApiConfigService } from '../../../config/api-config.service'
import type { JwtPayload, AuthenticatedUser } from '../../../common/types/authenticated-request'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtAccessSecret,
    })
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload.sub || !payload.esfId) {
      throw new UnauthorizedException()
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      esfId: payload.esfId,
      esfName: payload.esfName,
      esfCode: payload.esfCode,
    }
  }
}
