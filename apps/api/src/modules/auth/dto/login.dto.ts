import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ type: String, example: 'gabriela@esf.gov.br', format: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ type: String, example: 'SenhaSegura@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string
}
