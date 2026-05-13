import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { EsfRepository } from './esf.repository'
import type { CreateEsfDto } from './dto/create-esf.dto'

@Injectable()
export class EsfService {
  constructor(private readonly esfRepository: EsfRepository) {}

  async findAll() {
    return this.esfRepository.findAll()
  }

  async findById(id: string) {
    const esf = await this.esfRepository.findById(id)
    if (!esf) throw new NotFoundException('ESF não encontrada')
    return esf
  }

  async create(dto: CreateEsfDto) {
    const existing = await this.esfRepository.findByCode(dto.code)
    if (existing) throw new ConflictException('Código de ESF já cadastrado')

    const [esf] = await this.esfRepository.create(dto)
    return esf
  }

  async update(id: string, dto: Partial<CreateEsfDto>) {
    await this.findById(id)
    const [updated] = await this.esfRepository.update(id, dto)
    return updated
  }
}
