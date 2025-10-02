import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig, ConfigKey } from './entities/system-config.entity';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
  ) {}

  async create(createSystemConfigDto: CreateSystemConfigDto): Promise<SystemConfig> {
    const config = this.systemConfigRepository.create(createSystemConfigDto);
    return this.systemConfigRepository.save(config);
  }

  async findAll(): Promise<SystemConfig[]> {
    return this.systemConfigRepository.find({
      order: { key: 'ASC' },
    });
  }

  async findOne(id: string): Promise<SystemConfig> {
    const config = await this.systemConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`System config with ID ${id} not found`);
    }

    return config;
  }

  async findByKey(key: ConfigKey): Promise<SystemConfig | null> {
    return this.systemConfigRepository.findOne({
      where: { key },
    });
  }

  async getValue(key: ConfigKey, defaultValue?: string): Promise<string | null> {
    const config = await this.findByKey(key);
    return config ? config.value : defaultValue || null;
  }

  async setValue(key: ConfigKey, value: string, description?: string): Promise<SystemConfig> {
    let config = await this.findByKey(key);
    
    if (config) {
      config.value = value;
      if (description) {
        config.description = description;
      }
    } else {
      config = this.systemConfigRepository.create({
        key,
        value,
        description,
      });
    }

    return this.systemConfigRepository.save(config);
  }

  async update(id: string, updateSystemConfigDto: UpdateSystemConfigDto): Promise<SystemConfig> {
    const config = await this.findOne(id);
    Object.assign(config, updateSystemConfigDto);
    return this.systemConfigRepository.save(config);
  }

  async remove(id: string): Promise<void> {
    const result = await this.systemConfigRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`System config with ID ${id} not found`);
    }
  }

  async initializeDefaults(): Promise<void> {
    const defaults = [
      { key: ConfigKey.SLA_WARNING_THRESHOLD, value: '75', description: 'SLA warning threshold percentage' },
      { key: ConfigKey.SLA_BREACH_THRESHOLD, value: '100', description: 'SLA breach threshold percentage' },
      { key: ConfigKey.FAILED_LOGIN_ATTEMPTS_LIMIT, value: '5', description: 'Failed login attempts before account lock' },
      { key: ConfigKey.PASSWORD_MIN_LENGTH, value: '8', description: 'Minimum password length' },
      { key: ConfigKey.REQUIRE_2FA_FOR_ADMIN, value: 'false', description: 'Require 2FA for admin users' },
      { key: ConfigKey.BACKUP_ENABLED, value: 'true', description: 'Enable automatic backups' },
      { key: ConfigKey.BACKUP_SCHEDULE, value: '0 2 * * *', description: 'Backup schedule (cron format)' },
      { key: ConfigKey.EMAIL_NOTIFICATIONS_ENABLED, value: 'true', description: 'Enable email notifications' },
      { key: ConfigKey.WHATSAPP_INTEGRATION_ENABLED, value: 'false', description: 'Enable WhatsApp integration' },
      { key: ConfigKey.INVOICING_ENABLED, value: 'true', description: 'Enable invoicing module' },
      { key: ConfigKey.AI_CATEGORIZATION_ENABLED, value: 'false', description: 'Enable AI ticket categorization' },
    ];

    for (const defaultConfig of defaults) {
      const existing = await this.findByKey(defaultConfig.key);
      if (!existing) {
        await this.setValue(defaultConfig.key, defaultConfig.value, defaultConfig.description);
      }
    }
  }
}
