import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator'

export class CreateAccessRequestDto {
  @IsString()
  @Length(2, 100)
  name: string

  @IsEmail()
  email: string

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' })
  cpf: string

  @IsEnum(['admin', 'manager', 'nurse', 'doctor', 'acs'])
  role: string

  @IsOptional()
  @IsUUID()
  esfId?: string

  @IsOptional()
  @IsString()
  esfName?: string

  @IsOptional()
  @IsString()
  @Length(7, 7)
  cnes?: string

  @IsOptional()
  @IsString()
  message?: string
}
