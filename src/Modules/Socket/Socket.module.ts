import { Module } from '@nestjs/common';
import { VersionModule } from '../Version/version.module';
import { SocketService } from './Socket.service';

@Module({
  imports: [VersionModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
