import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { MockReportsService } from './reports.service.mock';

@Module({
  controllers: [ReportsController],
  providers: [
    {
      provide: 'ReportsService',
      useClass: MockReportsService,
    },
  ],
  exports: ['ReportsService'],
})
export class ReportsModule {}