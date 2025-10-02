import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuditLog } from './entities/audit-log.entity';
import { AuditLogsController } from './audit-logs.controller';
import { MockAuditLogsService } from './audit-logs.service.mock';

@Module({
  imports: [/* TypeOrmModule.forFeature([AuditLog]) */],
  controllers: [AuditLogsController],
  providers: [
    {
      provide: 'AuditLogsService',
      useClass: MockAuditLogsService,
    },
  ],
  exports: [{
    provide: 'AuditLogsService',
    useClass: MockAuditLogsService,
  }],
})
export class AuditLogsModule {}
