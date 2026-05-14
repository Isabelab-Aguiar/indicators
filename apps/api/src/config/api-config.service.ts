import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.getOrThrow<number>('PORT')
  }

  get nodeEnv(): string {
    return this.configService.getOrThrow<string>('NODE_ENV')
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>('DATABASE_URL')
  }

  get redisUrl(): string {
    return this.configService.getOrThrow<string>('REDIS_URL')
  }

  get jwtAccessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET')
  }

  get jwtRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')
  }

  get allowedOrigins(): string[] {
    const origins = this.configService.getOrThrow<string>('ALLOWED_ORIGINS')
    return origins.split(',').map((o) => o.trim())
  }

  get r2AccountId(): string | undefined {
    return this.configService.get<string>('R2_ACCOUNT_ID')
  }

  get r2AccessKeyId(): string | undefined {
    return this.configService.get<string>('R2_ACCESS_KEY_ID')
  }

  get r2SecretAccessKey(): string | undefined {
    return this.configService.get<string>('R2_SECRET_ACCESS_KEY')
  }

  get r2Bucket(): string | undefined {
    return this.configService.get<string>('R2_BUCKET')
  }

  get isR2Configured(): boolean {
    return Boolean(
      this.r2AccountId && this.r2AccessKeyId && this.r2SecretAccessKey && this.r2Bucket,
    )
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production'
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development'
  }
}
