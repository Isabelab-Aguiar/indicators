import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PregnantWomanFiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string
  @ApiPropertyOptional() @IsOptional() @IsString() microarea?: string

  @ApiPropertyOptional({ enum: ['normal', 'elevated', 'high', 'critical'] })
  @IsOptional()
  @IsEnum(['normal', 'elevated', 'high', 'critical'])
  bloodPressureStatus?: string

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  pageSize?: number
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'
}
