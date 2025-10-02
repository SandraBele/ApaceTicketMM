import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { MockFinancialService } from './financial.service.mock';

@Module({
  controllers: [FinancialController],
  providers: [
    {
      provide: 'FinancialService',
      useClass: MockFinancialService,
    },
  ],
  exports: ['FinancialService'],
})
export class FinancialModule {}