import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ type: String, example: '051.894.726-20 ou email@esf.gov.br' })
  @IsString()
  identifier: string

  @ApiProperty({ type: String, example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string
}
