import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum AuditAction {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DEACTIVATED = 'user_deactivated',
  USER_REACTIVATED = 'user_reactivated',
  USER_DELETED = 'user_deleted',
  PASSWORD_RESET = 'password_reset',
  ROLE_CHANGED = 'role_changed',
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_ASSIGNED = 'ticket_assigned',
  TICKET_DELETED = 'ticket_deleted',
  KPI_CONFIGURED = 'kpi_configured',
  SLA_CONFIGURED = 'sla_configured',
  TEAM_CREATED = 'team_created',
  TEAM_UPDATED = 'team_updated',
  INVOICE_CREATED = 'invoice_created',
  INVOICE_UPDATED = 'invoice_updated',
  EMAIL_SENT = 'email_sent',
  BACKUP_TRIGGERED = 'backup_triggered',
  BACKUP_FAILED = 'backup_failed',
  SECRET_ROTATED = 'secret_rotated',
  LOGIN_FAILED = 'login_failed',
  LOGIN_SUCCESS = 'login_success',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
}

@Entity('audit_logs')
export class AuditLog {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: AuditAction })
  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @ApiProperty()
  @Column({ nullable: true })
  performedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedById' })
  performedBy: User;

  @ApiProperty()
  @Column({ nullable: true })
  targetUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'targetUserId' })
  targetUser: User;

  @ApiProperty()
  @Column({ nullable: true })
  entityType: string;

  @ApiProperty()
  @Column({ nullable: true })
  entityId: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  details: string;

  @ApiProperty()
  @Column({ nullable: true })
  ipAddress: string;

  @ApiProperty()
  @Column({ nullable: true })
  userAgent: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
