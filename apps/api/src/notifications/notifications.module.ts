import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { MockNotificationsService } from './notifications.service.mock';

@Module({
  controllers: [NotificationsController],
  providers: [
    {
      provide: 'NotificationsService',
      useClass: MockNotificationsService,
    },
  ],
  exports: ['NotificationsService'],
})
export class NotificationsModule {}