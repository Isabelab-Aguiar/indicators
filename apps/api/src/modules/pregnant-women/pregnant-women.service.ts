import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { PregnantWomenRepository } from './pregnant-women.repository'
import type { CreatePregnantWomanDto } from './dto/create-pregnant-woman.dto'
import type { PregnantWomanFiltersDto } from './dto/pregnant-woman-filters.dto'
import type { TenantContextPayload } from '../../common/tenant/tenant-context'
import { BLOOD_PRESSURE_THRESHOLDS } from '@repo/config'

@Injectable()
export class PregnantWomenService {
  constructor(private readonly repository: PregnantWomenRepository) {}

  async findAll(tenant: TenantContextPayload, filters: PregnantWomanFiltersDto) {
    return this.repository.findAll(tenant.esfId, filters)
  }

  async findById(id: string, tenant: TenantContextPayload) {
    const record = await this.repository.findById(id, tenant.esfId)
    if (!record) throw new NotFoundException('Gestante não encontrada')
    return record
  }

  async create(dto: CreatePregnantWomanDto, tenant: TenantContextPayload) {
    const existing = await this.repository.findByCpfAndEsf(dto.cpf, tenant.esfId)
    if (existing) throw new ConflictException('CPF já cadastrado nesta ESF')

    const bloodPressureStatus = dto.bloodPressure
      ? this.classifyBloodPressure(dto.bloodPressure)
      : null

    const [created] = await this.repository.create({
      ...dto,
      ...(bloodPressureStatus ? { bloodPressureStatus } : {}),
      esfId: tenant.esfId,
      updatedBy: tenant.userId,
    })

    return created
  }

  async update(id: string, dto: Partial<CreatePregnantWomanDto>, tenant: TenantContextPayload) {
    await this.findById(id, tenant)

    const bloodPressureStatus = dto.bloodPressure
      ? this.classifyBloodPressure(dto.bloodPressure)
      : undefined

    const [updated] = await this.repository.update(id, tenant.esfId, {
      ...dto,
      ...(bloodPressureStatus ? { bloodPressureStatus } : {}),
      updatedBy: tenant.userId,
    })

    return updated
  }

  async delete(id: string, tenant: TenantContextPayload) {
    await this.findById(id, tenant)
    await this.repository.delete(id, tenant.esfId)
  }

  private classifyBloodPressure(bp: string): 'normal' | 'elevated' | 'high' | 'critical' {
    const [systolicStr, diastolicStr] = bp.split('/')
    const systolic = parseInt(systolicStr ?? '0', 10)
    const diastolic = parseInt(diastolicStr ?? '0', 10)

    if (
      systolic >= BLOOD_PRESSURE_THRESHOLDS.CRITICAL.systolic ||
      diastolic >= BLOOD_PRESSURE_THRESHOLDS.CRITICAL.diastolic
    )
      return 'critical'
    if (
      systolic >= BLOOD_PRESSURE_THRESHOLDS.HIGH.systolic ||
      diastolic >= BLOOD_PRESSURE_THRESHOLDS.HIGH.diastolic
    )
      return 'high'
    if (
      systolic >= BLOOD_PRESSURE_THRESHOLDS.ELEVATED.systolic ||
      diastolic >= BLOOD_PRESSURE_THRESHOLDS.ELEVATED.diastolic
    )
      return 'elevated'
    return 'normal'
  }
}
