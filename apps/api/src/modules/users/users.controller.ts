import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { UsersService } from './users.service'
import { InviteUserDto } from './dto/invite-user.dto'
import { CurrentTenant } from '../../common/tenant/current-tenant.decorator'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Listar usuários da ESF autenticada' })
  findAll(@CurrentTenant() tenant: TenantContextPayload) {
    return this.usersService.findAllByEsf(tenant)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  findById(@Param('id', ParseUUIDPipe) id: string, @CurrentTenant() tenant: TenantContextPayload) {
    return this.usersService.findById(id, tenant)
  }

  @Post('invite')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Convidar novo usuário' })
  invite(@Body() dto: InviteUserDto, @CurrentTenant() tenant: TenantContextPayload) {
    return this.usersService.invite(dto, tenant)
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar usuário' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenant: TenantContextPayload,
  ) {
    return this.usersService.deactivate(id, tenant)
  }
}
