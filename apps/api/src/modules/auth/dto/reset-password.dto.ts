import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MinLength } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({ example: 'gabriela@esf.gov.br' })
  @IsString()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Deve conter ao menos uma letra maiúscula' })
  @Matches(/[0-9]/, { message: 'Deve conter ao menos um número' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Deve conter ao menos um caractere especial' })
  password: string

  @ApiProperty()
  @IsString()
  confirmPassword: string
}

export class FirstAccessDto {
  @ApiProperty()
  @IsString()
  token: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Deve conter ao menos uma letra maiúscula' })
  @Matches(/[0-9]/, { message: 'Deve conter ao menos um número' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Deve conter ao menos um caractere especial' })
  password: string
}
