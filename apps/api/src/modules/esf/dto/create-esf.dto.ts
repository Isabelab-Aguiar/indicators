import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches } from 'class-validator'

export class CreateEsfDto {
  @ApiProperty({ type: String, example: 'Catalão' })
  @IsString()
  @Length(2, 100)
  name: string

  @ApiProperty({ type: String, example: 'ESF-CAT-01' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'Código deve conter apenas letras maiúsculas, números e hífens',
  })
  code: string
}
