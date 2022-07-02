import { Module } from '@nestjs/common';
import { SocketModule } from './Socket/Socket.module';
import { VersionModule } from './Version/version.module';

@Module({ imports: [VersionModule, SocketModule] })
export class ModulesModule {}
