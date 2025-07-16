import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './Database/Database.module';
import { HealthModule } from './Health/Health.module';
import { SocketModule } from './Socket/Socket.module';
import { TaskModule } from './Task/Task.module';
import { VersionModule } from './Version/version.module';
import { SmbModule } from '@tools/nestjs-smb2';
import smb from '../config/smb.json';
import { LocalCacheModule } from './Cache/Cache.module';

@Module({
  imports: [
    SmbModule.register({ server: smb.url, ...smb.credentials, isGlobal: true }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    HealthModule,
    VersionModule,
    SocketModule,
    TaskModule,
    LocalCacheModule,
  ],
})
export class ModulesModule {}
