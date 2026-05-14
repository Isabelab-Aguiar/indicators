import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

const ExamResult = ['pending', 'negative', 'positive', 'not_performed'] as const
type ExamResultType = (typeof ExamResult)[number]

export class CreatePregnantWomanDto {
  @ApiProperty({ type: String }) @IsString() @MinLength(3) @MaxLength(255) name: string
  @ApiProperty({ type: String }) @IsString() @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/) cpf: string
  @ApiProperty({ type: String }) @IsDateString() birthDate: string
  @ApiProperty({ type: String }) @IsString() @MinLength(5) @MaxLength(500) address: string
  @ApiProperty({ type: String }) @IsString() @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/) phone: string
  @ApiProperty({ type: String }) @IsString() @MinLength(1) @MaxLength(50) microarea: string

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weight?: number
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  height?: number
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bloodPressure?: string
  @ApiPropertyOptional({ type: String }) @IsOptional() @IsDateString() lastMeasurementDate?: string
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) daysSinceDoctor?: number
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) daysSinceNursing?: number
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) daysSinceDentist?: number
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) daysSinceHomeVisit?: number

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  prenatalConsultations?: number
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  consultationsUpTo12Weeks?: number
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  bloodPressureMeasurements?: number
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  weightHeightMeasurements?: number
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) homeVisits?: number
  @ApiPropertyOptional({ type: Number }) @IsOptional() @IsInt() @Min(0) dentalAppointments?: number

  @ApiPropertyOptional({ type: Boolean }) @IsOptional() @IsBoolean() dtpaRegistered?: boolean
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  hivExam1stTrimester?: ExamResultType
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  syphilisExam1stTrimester?: ExamResultType
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  hepatitisBExam1stTrimester?: ExamResultType
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  hepatitisCExam1stTrimester?: ExamResultType
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  hivExam3rdTrimester?: ExamResultType
  @ApiPropertyOptional({ enum: ExamResult })
  @IsOptional()
  @IsEnum(ExamResult)
  syphilisExam3rdTrimester?: ExamResultType
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observations?: string
}
