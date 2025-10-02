import { Injectable } from '@nestjs/common';

export interface SystemConfig {
  id: string;
  category: 'general' | 'security' | 'notifications' | 'sla' | 'integrations' | 'appearance';
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isPublic: boolean; // Whether this setting can be accessed by non-admin users
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface BackupStatus {
  id: string;
  type: 'automatic' | 'manual';
  status: 'in_progress' | 'completed' | 'failed';
  fileName: string;
  fileSize: number; // bytes
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    database: 'healthy' | 'warning' | 'critical';
    api: 'healthy' | 'warning' | 'critical';
    authentication: 'healthy' | 'warning' | 'critical';
    notifications: 'healthy' | 'warning' | 'critical';
    fileStorage: 'healthy' | 'warning' | 'critical';
  };
  metrics: {
    uptime: number; // seconds
    responseTime: number; // milliseconds
    errorRate: number; // percentage
    memoryUsage: number; // percentage
    cpuUsage: number; // percentage
  };
  lastChecked: string;
}

@Injectable()
export class MockSystemConfigService {
  private configs: SystemConfig[] = [
    // General Settings
    {
      id: '1',
      category: 'general',
      key: 'company_name',
      value: 'ApaceTicket',
      type: 'string',
      description: 'Company name displayed throughout the application',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '2',
      category: 'general',
      key: 'default_timezone',
      value: 'UTC',
      type: 'string',
      description: 'Default timezone for the application',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '3',
      category: 'general',
      key: 'max_file_upload_size',
      value: 10485760,
      type: 'number',
      description: 'Maximum file upload size in bytes (10MB)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    
    // Security Settings
    {
      id: '4',
      category: 'security',
      key: 'session_timeout',
      value: 3600,
      type: 'number',
      description: 'Session timeout in seconds (1 hour)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '5',
      category: 'security',
      key: 'password_min_length',
      value: 8,
      type: 'number',
      description: 'Minimum password length requirement',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '6',
      category: 'security',
      key: 'require_2fa',
      value: false,
      type: 'boolean',
      description: 'Require two-factor authentication for all users',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '7',
      category: 'security',
      key: 'max_login_attempts',
      value: 5,
      type: 'number',
      description: 'Maximum login attempts before account lockout',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    
    // SLA Settings
    {
      id: '8',
      category: 'sla',
      key: 'default_sla_critical',
      value: 2,
      type: 'number',
      description: 'Default SLA for critical priority tickets (hours)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '9',
      category: 'sla',
      key: 'default_sla_high',
      value: 8,
      type: 'number',
      description: 'Default SLA for high priority tickets (hours)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '10',
      category: 'sla',
      key: 'default_sla_medium',
      value: 24,
      type: 'number',
      description: 'Default SLA for medium priority tickets (hours)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '11',
      category: 'sla',
      key: 'default_sla_low',
      value: 72,
      type: 'number',
      description: 'Default SLA for low priority tickets (hours)',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    
    // Notification Settings
    {
      id: '12',
      category: 'notifications',
      key: 'email_notifications_enabled',
      value: true,
      type: 'boolean',
      description: 'Enable email notifications',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '13',
      category: 'notifications',
      key: 'sla_breach_notification',
      value: true,
      type: 'boolean',
      description: 'Send notifications for SLA breaches',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '14',
      category: 'notifications',
      key: 'smtp_server',
      value: 'smtp.mailhog.local',
      type: 'string',
      description: 'SMTP server for sending emails',
      isPublic: false,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    
    // Appearance Settings
    {
      id: '15',
      category: 'appearance',
      key: 'primary_color',
      value: '#3b82f6',
      type: 'string',
      description: 'Primary brand color',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    },
    {
      id: '16',
      category: 'appearance',
      key: 'logo_url',
      value: '/images/logo.png',
      type: 'string',
      description: 'Company logo URL',
      isPublic: true,
      isEditable: true,
      updatedAt: '2024-09-01T00:00:00Z',
      updatedBy: 'admin'
    }
  ];

  private backups: BackupStatus[] = [
    {
      id: '1',
      type: 'automatic',
      status: 'completed',
      fileName: 'backup_2024-10-01_daily.sql',
      fileSize: 15728640, // 15MB
      createdAt: '2024-10-01T02:00:00Z',
      completedAt: '2024-10-01T02:15:00Z',
      downloadUrl: '/backups/backup_2024-10-01_daily.sql'
    },
    {
      id: '2',
      type: 'automatic',
      status: 'completed',
      fileName: 'backup_2024-09-30_daily.sql',
      fileSize: 15532800, // 14.8MB
      createdAt: '2024-09-30T02:00:00Z',
      completedAt: '2024-09-30T02:12:00Z',
      downloadUrl: '/backups/backup_2024-09-30_daily.sql'
    },
    {
      id: '3',
      type: 'manual',
      status: 'completed',
      fileName: 'backup_2024-09-28_manual.sql',
      fileSize: 15421440, // 14.7MB
      createdAt: '2024-09-28T14:30:00Z',
      completedAt: '2024-09-28T14:42:00Z',
      downloadUrl: '/backups/backup_2024-09-28_manual.sql'
    }
  ];

  async findAllConfigs(category?: string, isPublic?: boolean): Promise<SystemConfig[]> {
    let filteredConfigs = [...this.configs];
    
    if (category) {
      filteredConfigs = filteredConfigs.filter(config => config.category === category);
    }
    
    if (isPublic !== undefined) {
      filteredConfigs = filteredConfigs.filter(config => config.isPublic === isPublic);
    }
    
    return filteredConfigs;
  }

  async findConfigByKey(key: string): Promise<SystemConfig | undefined> {
    return this.configs.find(config => config.key === key);
  }

  async updateConfig(key: string, value: any, updatedBy: string): Promise<SystemConfig | undefined> {
    const configIndex = this.configs.findIndex(config => config.key === key);
    if (configIndex === -1) {
      return undefined;
    }

    const config = this.configs[configIndex];
    if (!config.isEditable) {
      throw new Error('Configuration is not editable');
    }

    config.value = value;
    config.updatedAt = new Date().toISOString();
    config.updatedBy = updatedBy;
    
    return config;
  }

  async createConfig(configData: Partial<SystemConfig>): Promise<SystemConfig> {
    const newConfig: SystemConfig = {
      id: (this.configs.length + 1).toString(),
      category: configData.category || 'general',
      key: configData.key || '',
      value: configData.value,
      type: configData.type || 'string',
      description: configData.description || '',
      isPublic: configData.isPublic || false,
      isEditable: configData.isEditable !== undefined ? configData.isEditable : true,
      updatedAt: new Date().toISOString(),
      updatedBy: configData.updatedBy || 'system'
    };

    this.configs.push(newConfig);
    return newConfig;
  }

  async deleteConfig(key: string): Promise<boolean> {
    const configIndex = this.configs.findIndex(config => config.key === key);
    if (configIndex === -1) {
      return false;
    }

    this.configs.splice(configIndex, 1);
    return true;
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // Simulate system health check
    return {
      overall: 'healthy',
      components: {
        database: 'healthy',
        api: 'healthy',
        authentication: 'healthy',
        notifications: 'healthy',
        fileStorage: 'healthy'
      },
      metrics: {
        uptime: 86400 * 7, // 7 days
        responseTime: 125,
        errorRate: 0.2,
        memoryUsage: 68.5,
        cpuUsage: 23.1
      },
      lastChecked: new Date().toISOString()
    };
  }

  async getBackups(): Promise<BackupStatus[]> {
    return this.backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBackup(type: 'automatic' | 'manual' = 'manual'): Promise<BackupStatus> {
    const timestamp = new Date().toISOString().split('T')[0];
    const typeLabel = type === 'automatic' ? 'daily' : 'manual';
    
    const newBackup: BackupStatus = {
      id: (this.backups.length + 1).toString(),
      type,
      status: 'in_progress',
      fileName: `backup_${timestamp}_${typeLabel}.sql`,
      fileSize: 0,
      createdAt: new Date().toISOString()
    };

    this.backups.push(newBackup);

    // Simulate backup process
    setTimeout(() => {
      newBackup.status = 'completed';
      newBackup.fileSize = Math.floor(Math.random() * 5000000) + 10000000; // 10-15MB
      newBackup.completedAt = new Date().toISOString();
      newBackup.downloadUrl = `/backups/${newBackup.fileName}`;
    }, 3000);

    return newBackup;
  }

  async deleteBackup(id: string): Promise<boolean> {
    const backupIndex = this.backups.findIndex(backup => backup.id === id);
    if (backupIndex === -1) {
      return false;
    }

    this.backups.splice(backupIndex, 1);
    return true;
  }

  async getConfigCategories(): Promise<string[]> {
    const categories = [...new Set(this.configs.map(config => config.category))];
    return categories.sort();
  }
}