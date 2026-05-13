import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'gabriela@esf.gov.br' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'SenhaSegura@123' })
  @IsString()
  @MinLength(8)
  password: string
}
