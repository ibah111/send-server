import { Module } from '@nestjs/common';
import { checkConnection } from './checkConnection';

@Module({
  providers: [checkConnection],
})
export class SocketsModule {}
