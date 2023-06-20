import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ToolsTerminusModule } from '@tools/terminus-indicators';
import { SmbModule } from '../Smb/Smb.module';
import { SocketModule } from '../Socket/Socket.module';
import { HealthController } from './Health.controller';
import { HealthService } from './Health.service';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ToolsTerminusModule,
    SocketModule,
    SmbModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
