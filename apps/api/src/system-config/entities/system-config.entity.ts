import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ConfigKey {
  SLA_WARNING_THRESHOLD = 'sla_warning_threshold',
  SLA_BREACH_THRESHOLD = 'sla_breach_threshold',
  FAILED_LOGIN_ATTEMPTS_LIMIT = 'failed_login_attempts_limit',
  PASSWORD_MIN_LENGTH = 'password_min_length',
  REQUIRE_2FA_FOR_ADMIN = 'require_2fa_for_admin',
  BACKUP_ENABLED = 'backup_enabled',
  BACKUP_SCHEDULE = 'backup_schedule',
  EMAIL_NOTIFICATIONS_ENABLED = 'email_notifications_enabled',
  WHATSAPP_INTEGRATION_ENABLED = 'whatsapp_integration_enabled',
  INVOICING_ENABLED = 'invoicing_enabled',
  AI_CATEGORIZATION_ENABLED = 'ai_categorization_enabled',
}

@Entity('system_config')
export class SystemConfig {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: ConfigKey })
  @Column({ type: 'enum', enum: ConfigKey, unique: true })
  key: ConfigKey;

  @ApiProperty()
  @Column('text')
  value: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
