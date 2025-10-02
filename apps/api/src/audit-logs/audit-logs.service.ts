import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create(createAuditLogDto);
    return this.auditLogsRepository.save(auditLog);
  }

  async logAction(
    action: AuditAction,
    performedById?: string,
    targetUserId?: string,
    entityType?: string,
    entityId?: string,
    details?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    return this.create({
      action,
      performedById,
      targetUserId,
      entityType,
      entityId,
      details,
      ipAddress,
      userAgent,
    });
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      relations: ['performedBy', 'targetUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: [{ performedById: userId }, { targetUserId: userId }],
      relations: ['performedBy', 'targetUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogsRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.performedBy', 'performedBy')
      .leftJoinAndSelect('audit_log.targetUser', 'targetUser')
      .where('audit_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('audit_log.createdAt', 'DESC')
      .getMany();
  }
}
