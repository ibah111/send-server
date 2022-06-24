import { Module } from '@nestjs/common';
import { checkConnection } from './checkConnection';
import { VersionModule } from './version/version.module';

@Module({
  imports: [VersionModule],
  providers: [checkConnection],
})
export class SocketsModule {}
