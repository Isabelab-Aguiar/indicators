import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto, FirstAccessDto, ResetPasswordDto } from './dto/reset-password.dto'
import { Public } from './decorators/public.decorator'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { RATE_LIMIT, TOKEN_EXPIRY } from '@repo/config'
import type { JwtPayload } from '../../common/types/authenticated-request'

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: RATE_LIMIT.AUTH_WINDOW_MS, limit: RATE_LIMIT.AUTH_MAX_REQUESTS } })
  @ApiOperation({ summary: 'Login com e-mail e senha' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto)
    this.setRefreshTokenCookie(res, tokens.refreshToken)
    return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn }
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  async refresh(
    @Req() req: Request & { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(req.user.sub)
    this.setRefreshTokenCookie(res, tokens.refreshToken)
    return { accessToken: tokens.accessToken, expiresIn: tokens.expiresIn }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Encerrar sessão' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token')
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { ttl: RATE_LIMIT.AUTH_WINDOW_MS, limit: 5 } })
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email)
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Redefinir senha' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password)
  }

  @Public()
  @Post('first-access')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Configurar senha no primeiro acesso' })
  async firstAccess(@Body() dto: FirstAccessDto) {
    await this.authService.completeFirstAccess(dto.token, dto.password)
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    })
  }
}
