import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { C5Service } from './c5.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'
import { UPLOAD } from '@repo/config'

@ApiTags('C5 - Cuidado da Pessoa com Hipertensão')
@Controller({ path: 'c5', version: '1' })
export class C5Controller {
  constructor(private readonly c5Service: C5Service) {}

  @Get('breakdown')
  @ApiOperation({ summary: 'Breakdown C5 por paciente hipertenso' })
  @ApiQuery({ name: 'periodo', required: false })
  getBreakdown(@CurrentTenant() tenant: TenantContextPayload, @Query('periodo') periodo?: string) {
    return this.c5Service.getBreakdown(tenant, periodo)
  }

  @Post('import')
  @Roles('admin', 'manager', 'nurse')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: UPLOAD.MAX_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        periodo: { type: 'string', example: '2024-1' },
      },
    },
  })
  @ApiOperation({ summary: 'Importar CSV do e-SUS (Acompanhamento de Condições de Saúde) para C5' })
  importCsv(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('periodo') periodo: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    if (!file) throw new BadRequestException('Arquivo CSV não recebido')
    if (!periodo) throw new BadRequestException('Parâmetro periodo obrigatório')
    return this.c5Service.importCsv(file.buffer.toString('latin1'), periodo, tenant)
  }

  @Get('patients')
  @ApiOperation({ summary: 'Listar registros brutos C5 da ESF' })
  @ApiQuery({ name: 'periodo', required: false })
  getPatients(@CurrentTenant() tenant: TenantContextPayload, @Query('periodo') periodo?: string) {
    return this.c5Service.getPatients(tenant, periodo)
  }
}
