import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { ApiConfigService } from '../../config/api-config.service'
import { DATABASE_TOKEN } from '../../database/database.module'
import type * as schema from '../../database/schema'
import { profiles } from '../../database/schema'
import { TOKEN_EXPIRY } from '@repo/config'
import type { LoginDto } from './dto/login.dto'
import type { AuthTokenPayload } from './types/auth-token-payload'
import { Inject } from '@nestjs/common'

type Database = NodePgDatabase<typeof schema>

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database,
    private readonly jwtService: JwtService,
    private readonly config: ApiConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthTokenPayload> {
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.email, dto.email.toLowerCase()),
      with: { esf: true },
    })

    if (!user || user.status === 'inactive') {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    return this.generateTokens(user, user.esf)
  }

  async refreshTokens(userId: string): Promise<AuthTokenPayload> {
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
      with: { esf: true },
    })

    if (!user || user.status === 'inactive') {
      throw new UnauthorizedException('Sessão inválida')
    }

    return this.generateTokens(user, user.esf)
  }

  async completeFirstAccess(token: string, password: string): Promise<void> {
    const invite = await this.findValidInviteToken(token)
    const passwordHash = await argon2.hash(password)

    await this.db
      .update(profiles)
      .set({ passwordHash, status: 'active', updatedAt: new Date() })
      .where(eq(profiles.email, invite.email))
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.db.query.profiles.findFirst({
      where: eq(profiles.email, email.toLowerCase()),
    })

    if (!user) return
    // email sending handled by notification service
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const invite = await this.findValidInviteToken(token)
    const passwordHash = await argon2.hash(password)

    await this.db
      .update(profiles)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(profiles.email, invite.email))
  }

  private generateTokens(
    user: { id: string; email: string; role: string },
    esf: { id: string; name: string; code: string },
  ): AuthTokenPayload {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      esfId: esf.id,
      esfName: esf.name,
      esfCode: esf.code,
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.jwtAccessSecret,
      expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN_SECONDS,
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.jwtRefreshSecret,
      expiresIn: `${TOKEN_EXPIRY.REFRESH_TOKEN_DAYS}d`,
    })

    return { accessToken, refreshToken, expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN_SECONDS }
  }

  private async findValidInviteToken(token: string) {
    const { inviteTokens } = await import('../../database/schema')
    const result = await this.db.query.inviteTokens.findFirst({
      where: eq(inviteTokens.token, token),
    })

    if (!result || result.usedAt || result.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado')
    }

    return result
  }
}
