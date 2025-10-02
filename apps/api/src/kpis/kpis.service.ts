import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KPI } from './entities/kpi.entity';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(KPI)
    private kpisRepository: Repository<KPI>,
  ) {}

  async create(createKpiDto: CreateKpiDto): Promise<KPI> {
    const kpi = this.kpisRepository.create(createKpiDto);
    return this.kpisRepository.save(kpi);
  }

  async findAll(): Promise<KPI[]> {
    return this.kpisRepository.find({
      relations: ['user'],
      order: { month: 'DESC' },
    });
  }

  async findOne(id: string): Promise<KPI> {
    const kpi = await this.kpisRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!kpi) {
      throw new NotFoundException(`KPI with ID ${id} not found`);
    }

    return kpi;
  }

  async findByUser(userId: string): Promise<KPI[]> {
    return this.kpisRepository.find({
      where: { userId },
      relations: ['user'],
      order: { month: 'DESC' },
    });
  }

  async update(id: string, updateKpiDto: UpdateKpiDto): Promise<KPI> {
    const kpi = await this.findOne(id);
    Object.assign(kpi, updateKpiDto);
    return this.kpisRepository.save(kpi);
  }

  async remove(id: string): Promise<void> {
    const result = await this.kpisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KPI with ID ${id} not found`);
    }
  }
}
