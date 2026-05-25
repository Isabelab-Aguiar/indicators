import { IsIn, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class C1FilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  periodo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['otimo', 'bom', 'suficiente', 'regular'])
  classificacao?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['acima_70', 'abaixo_10'])
  alerta?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  all?: string
}
