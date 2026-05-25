import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { memoryStorage } from 'multer'

import { C1Service } from './c1.service'
import { C1FilterDto } from './dto/c1-filter.dto'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'
import { UPLOAD } from '@repo/config'

@ApiTags('C1 - Mais Acesso')
@Controller({ path: 'c1', version: '1' })
export class C1Controller {
  constructor(private readonly c1Service: C1Service) {}

  @Post('importar-pdf')
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
        periodo: { type: 'string', example: '2024-Q1' },
      },
    },
  })
  @ApiOperation({ summary: 'Importar PDF e-SUS para cálculo C1' })
  importarPdf(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('periodo') periodo: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    if (!file) throw new BadRequestException('Arquivo PDF não recebido')
    return this.c1Service.importarPdf(file, periodo ?? 'Não identificado', tenant)
  }

  @Get('execucoes')
  @ApiOperation({ summary: 'Listar execuções C1 com filtros' })
  @ApiQuery({ name: 'periodo', required: false })
  @ApiQuery({ name: 'classificacao', required: false })
  @ApiQuery({ name: 'alerta', required: false })
  @ApiQuery({ name: 'all', required: false })
  findAllExecucoes(@Query() filters: C1FilterDto, @CurrentTenant() tenant: TenantContextPayload) {
    return this.c1Service.findAllExecucoes(tenant, filters)
  }

  @Get('execucoes/:id')
  @ApiOperation({ summary: 'Detalhes de uma execução C1' })
  findExecucaoById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.c1Service.findExecucaoById(id, tenant)
  }

  @Get('importacoes/:id')
  @ApiOperation({ summary: 'Status de uma importação C1' })
  findImportacaoById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.c1Service.findImportacaoById(id, tenant)
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Dados consolidados para gráficos C1' })
  getAnalytics(@CurrentTenant() tenant: TenantContextPayload) {
    return this.c1Service.getAnalytics(tenant)
  }

  @Get('exportar-csv')
  @Roles('admin', 'manager', 'nurse')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="c1-execucoes.csv"')
  @ApiOperation({ summary: 'Exportar execuções C1 em CSV' })
  exportarCsv(@CurrentTenant() tenant: TenantContextPayload) {
    return this.c1Service.exportarCsv(tenant)
  }

  @Delete('execucoes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'manager', 'nurse')
  @ApiOperation({ summary: 'Remover execução C1' })
  async deleteExecucao(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    await this.c1Service.deleteExecucao(id, tenant)
  }
}
