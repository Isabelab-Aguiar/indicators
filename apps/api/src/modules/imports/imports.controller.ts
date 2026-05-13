import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { memoryStorage } from 'multer'

import { ImportsService } from './imports.service'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'
import { UPLOAD } from '@repo/config'

@ApiTags('Imports')
@Controller({ path: 'imports', version: '1' })
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('csv')
  @Roles('admin', 'manager', 'nurse')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: UPLOAD.MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        cb(null, (UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype))
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @ApiOperation({ summary: 'Importar gestantes via CSV (enfileirado)' })
  importCsv(
    @UploadedFile() file: Express.Multer.File,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.importsService.queueCsvImport(file, tenant)
  }

  @Post('pdf')
  @Roles('admin', 'manager', 'nurse')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: UPLOAD.MAX_FILE_SIZE_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar gestantes via PDF (enfileirado)' })
  importPdf(
    @UploadedFile() file: Express.Multer.File,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.importsService.queuePdfImport(file, tenant)
  }

  @Get()
  @ApiOperation({ summary: 'Listar importações da ESF autenticada' })
  findAll(@CurrentTenant() tenant: TenantContextPayload) {
    return this.importsService.findAll(tenant)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Status de uma importação' })
  findById(@Param('id', ParseUUIDPipe) id: string, @CurrentTenant() tenant: TenantContextPayload) {
    return this.importsService.findById(id, tenant)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'manager', 'nurse')
  @ApiOperation({ summary: 'Remover importação (deleta arquivo no R2 e o registro)' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    await this.importsService.remove(id, tenant)
  }
}
