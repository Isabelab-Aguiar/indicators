import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { PregnantWomenService } from './pregnant-women.service'
import { CreatePregnantWomanDto } from './dto/create-pregnant-woman.dto'
import { PregnantWomanFiltersDto } from './dto/pregnant-woman-filters.dto'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('Pregnant Women')
@Controller({ path: 'pregnant-women', version: '1' })
export class PregnantWomenController {
  constructor(private readonly service: PregnantWomenService) {}

  @Get()
  @ApiOperation({ summary: 'Listar gestantes da ESF autenticada' })
  findAll(
    @CurrentTenant() tenant: TenantContextPayload,
    @Query() filters: PregnantWomanFiltersDto,
  ) {
    return this.service.findAll(tenant, filters)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar gestante por ID (somente da própria ESF)' })
  findById(@Param('id', ParseUUIDPipe) id: string, @CurrentTenant() tenant: TenantContextPayload) {
    return this.service.findById(id, tenant)
  }

  @Post()
  @Roles('admin', 'manager', 'nurse', 'doctor')
  @ApiOperation({ summary: 'Cadastrar nova gestante' })
  create(@Body() dto: CreatePregnantWomanDto, @CurrentTenant() tenant: TenantContextPayload) {
    return this.service.create(dto, tenant)
  }

  @Patch(':id')
  @Roles('admin', 'manager', 'nurse', 'doctor')
  @ApiOperation({ summary: 'Atualizar dados da gestante (somente da própria ESF)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePregnantWomanDto,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.service.update(id, dto, tenant)
  }

  @Delete()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover todas as gestantes da ESF autenticada' })
  deleteAll(@CurrentTenant() tenant: TenantContextPayload) {
    return this.service.deleteAll(tenant)
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover gestante (somente da própria ESF)' })
  delete(@Param('id', ParseUUIDPipe) id: string, @CurrentTenant() tenant: TenantContextPayload) {
    return this.service.delete(id, tenant)
  }
}
