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
import { C2Service } from './c2.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'
import { UPLOAD } from '@repo/config'

@ApiTags('C2 - Cuidado no Desenvolvimento Infantil')
@Controller({ path: 'c2', version: '1' })
export class C2Controller {
  constructor(private readonly c2Service: C2Service) {}

  @Get('breakdown')
  @ApiOperation({ summary: 'Breakdown C2 por criança acompanhada' })
  @ApiQuery({ name: 'periodo', required: false })
  getBreakdown(@CurrentTenant() tenant: TenantContextPayload, @Query('periodo') periodo?: string) {
    return this.c2Service.getBreakdown(tenant, periodo)
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
        periodo: { type: 'string', example: '2024-Q1' },
      },
    },
  })
  @ApiOperation({ summary: 'Importar CSV de crianças para C2' })
  importCsv(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('periodo') periodo: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    if (!file) throw new BadRequestException('Arquivo CSV não recebido')
    if (!periodo) throw new BadRequestException('Parâmetro periodo obrigatório')
    return this.c2Service.importCsv(file.buffer.toString('utf-8'), periodo, tenant)
  }

  @Get('import/template')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="c2-template.csv"')
  @ApiOperation({ summary: 'Download do template CSV para importação C2' })
  getTemplate() {
    return this.c2Service.getCsvTemplate()
  }
}
