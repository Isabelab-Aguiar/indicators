import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PregnantWomanFiltersDto {
  @ApiPropertyOptional({ type: String }) @IsOptional() @IsString() search?: string
  @ApiPropertyOptional({ type: String }) @IsOptional() @IsString() microarea?: string

  @ApiPropertyOptional({ enum: ['normal', 'elevated', 'high', 'critical'] })
  @IsOptional()
  @IsEnum(['normal', 'elevated', 'high', 'critical'])
  bloodPressureStatus?: string

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number
  @ApiPropertyOptional({ type: Number, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  pageSize?: number
  @ApiPropertyOptional({ type: String }) @IsOptional() @IsString() sortBy?: string
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'
}
