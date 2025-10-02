import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

class MockAuditLog implements AuditLog {
  id: string;
  action: any;
  performedById: string;
  performedBy: any;
  targetUserId: string;
  targetUser: any;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;

  constructor(data: Partial<AuditLog>) {
    Object.assign(this, data);
    this.performedBy = null;
    this.targetUser = null;
    this.createdAt = this.createdAt || new Date();
  }
}

@Injectable()
export class MockAuditLogsService {
  private logs: MockAuditLog[] = [];

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const log = new MockAuditLog({
      id: (this.logs.length + 1).toString(),
      ...createAuditLogDto,
      createdAt: new Date(),
    });
    
    this.logs.push(log);
    console.log('Audit Log:', log);
    return log;
  }

  async findAll(): Promise<AuditLog[]> {
    return this.logs;
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.logs.filter(log => log.performedById === userId || log.targetUserId === userId);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.logs.filter(log => 
      log.createdAt >= startDate && log.createdAt <= endDate
    );
  }
}