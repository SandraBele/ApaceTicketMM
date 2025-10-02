import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { MockTeamsService } from './teams.service.mock';

@Module({
  controllers: [TeamsController],
  providers: [
    {
      provide: 'TeamsService',
      useClass: MockTeamsService,
    },
  ],
  exports: ['TeamsService'],
})
export class TeamsModule {}