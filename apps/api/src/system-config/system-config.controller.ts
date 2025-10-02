import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemConfig, BackupStatus, SystemHealth } from './system-config.service.mock';

interface ISystemConfigService {
  findAllConfigs(category?: string, isPublic?: boolean): Promise<SystemConfig[]>;
  findConfigByKey(key: string): Promise<SystemConfig | undefined>;
  updateConfig(key: string, value: any, updatedBy: string): Promise<SystemConfig | undefined>;
  createConfig(configData: Partial<SystemConfig>): Promise<SystemConfig>;
  deleteConfig(key: string): Promise<boolean>;
  getSystemHealth(): Promise<SystemHealth>;
  getBackups(): Promise<BackupStatus[]>;
  createBackup(type?: 'automatic' | 'manual'): Promise<BackupStatus>;
  deleteBackup(id: string): Promise<boolean>;
  getConfigCategories(): Promise<string[]>;
}

@Controller('system-config')
@UseGuards(JwtAuthGuard)
export class SystemConfigController {
  constructor(
    @Inject('SystemConfigService') private readonly systemConfigService: ISystemConfigService,
  ) {}

  @Get('configs')
  async findAllConfigs(@Query('category') category?: string, @Query('isPublic') isPublic?: string) {
    const isPublicBool = isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;
    return await this.systemConfigService.findAllConfigs(category, isPublicBool);
  }

  @Get('configs/categories')
  async getConfigCategories() {
    return await this.systemConfigService.getConfigCategories();
  }

  @Get('health')
  async getSystemHealth() {
    return await this.systemConfigService.getSystemHealth();
  }

  @Get('backups')
  async getBackups() {
    return await this.systemConfigService.getBackups();
  }

  @Get('configs/:key')
  async findConfigByKey(@Param('key') key: string) {
    const config = await this.systemConfigService.findConfigByKey(key);
    if (!config) {
      throw new Error('Configuration not found');
    }
    return config;
  }

  @Post('configs')
  async createConfig(@Body() createConfigDto: any) {
    return await this.systemConfigService.createConfig(createConfigDto);
  }

  @Post('backups')
  async createBackup(@Body('type') type?: 'automatic' | 'manual') {
    return await this.systemConfigService.createBackup(type);
  }

  @Patch('configs/:key')
  async updateConfig(@Param('key') key: string, @Body() updateData: any) {
    const config = await this.systemConfigService.updateConfig(
      key, 
      updateData.value, 
      updateData.updatedBy || 'admin'
    );
    if (!config) {
      throw new Error('Configuration not found or not editable');
    }
    return config;
  }

  @Delete('configs/:key')
  async deleteConfig(@Param('key') key: string) {
    const success = await this.systemConfigService.deleteConfig(key);
    if (!success) {
      throw new Error('Configuration not found');
    }
    return { message: 'Configuration deleted successfully' };
  }

  @Delete('backups/:id')
  async deleteBackup(@Param('id') id: string) {
    const success = await this.systemConfigService.deleteBackup(id);
    if (!success) {
      throw new Error('Backup not found');
    }
    return { message: 'Backup deleted successfully' };
  }
}