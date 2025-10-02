import { Module } from '@nestjs/common';
import { SystemConfigController } from './system-config.controller';
import { MockSystemConfigService } from './system-config.service.mock';

@Module({
  controllers: [SystemConfigController],
  providers: [
    {
      provide: 'SystemConfigService',
      useClass: MockSystemConfigService,
    },
  ],
  exports: ['SystemConfigService'],
})
export class SystemConfigModule {}