import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { MockUsersService } from './users.service.mock';
import { UsersController } from './users.controller';
// import { User } from './entities/user.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]), // Temporarily disabled
    AuditLogsModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersService',
      useClass: MockUsersService,
    },
  ],
  exports: [{
    provide: 'UsersService',
    useClass: MockUsersService,
  }],
})
export class UsersModule {}