import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { memoryStorage } from 'multer'

import { C6Service } from './c6.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'
import { UPLOAD } from '@repo/config'

@ApiTags('C6 - Cuidado da Pessoa Idosa')
@Controller({ path: 'c6', version: '1' })
export class C6Controller {
  constructor(private readonly c6Service: C6Service) {}

  @Get('breakdown')
  @ApiOperation({ summary: 'Breakdown C6 por paciente idoso' })
  @ApiQuery({ name: 'periodo', required: false })
  getBreakdown(@CurrentTenant() tenant: TenantContextPayload, @Query('periodo') periodo?: string) {
    return this.c6Service.getBreakdown(tenant, periodo)
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
  @ApiOperation({ summary: 'Importar CSV de idosos para C6' })
  importCsv(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('periodo') periodo: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    if (!file) throw new BadRequestException('Arquivo CSV não recebido')
    if (!periodo) throw new BadRequestException('Parâmetro periodo obrigatório')
    const csvContent = file.buffer.toString('utf-8')
    return this.c6Service.importCsv(csvContent, periodo, tenant)
  }

  @Get('patients')
  @ApiOperation({ summary: 'Listar registros brutos C6 da ESF' })
  @ApiQuery({ name: 'periodo', required: false })
  getPatients(@CurrentTenant() tenant: TenantContextPayload, @Query('periodo') periodo?: string) {
    return this.c6Service.getPatients(tenant, periodo)
  }

  @Get('import/template')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="c6-template.csv"')
  @ApiOperation({ summary: 'Download do template CSV para importação C6' })
  getTemplate() {
    return this.c6Service.getCsvTemplate()
  }
}
