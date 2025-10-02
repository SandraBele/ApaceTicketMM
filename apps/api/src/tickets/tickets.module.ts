import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { MockTicketsService } from './tickets.service.mock';

@Module({
  controllers: [TicketsController],
  providers: [
    {
      provide: 'TicketsService',
      useClass: MockTicketsService,
    },
  ],
  exports: ['TicketsService'],
})
export class TicketsModule {}