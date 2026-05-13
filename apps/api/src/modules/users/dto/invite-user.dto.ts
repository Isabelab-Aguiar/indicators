import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator'

export class InviteUserDto {
  @ApiProperty() @IsEmail() email: string
  @ApiProperty() @IsString() @Length(2, 100) name: string
  @ApiProperty({ enum: ['admin', 'manager', 'nurse', 'doctor', 'acs'] })
  @IsEnum(['admin', 'manager', 'nurse', 'doctor', 'acs'])
  role: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  esfId?: string
}
