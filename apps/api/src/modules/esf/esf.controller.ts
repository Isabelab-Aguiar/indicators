import { Body, Controller, Get, Param, Post, Put, ParseUUIDPipe } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { EsfService } from './esf.service'
import { CreateEsfDto } from './dto/create-esf.dto'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('ESF')
@Controller({ path: 'esf', version: '1' })
export class EsfController {
  constructor(private readonly esfService: EsfService) {}

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Listar todas as ESFs' })
  findAll() {
    return this.esfService.findAll()
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Buscar ESF por ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.esfService.findById(id)
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar nova ESF (admin)' })
  create(@Body() dto: CreateEsfDto) {
    return this.esfService.create(dto)
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar ESF (admin)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateEsfDto) {
    return this.esfService.update(id, dto)
  }
}
