import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './Health/Health.module';
import { SocketModule } from './Socket/Socket.module';
import { TaskModule } from './Task/Task.module';
import { VersionModule } from './Version/version.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HealthModule,
    VersionModule,
    SocketModule,
    TaskModule,
  ],
})
export class ModulesModule {}
