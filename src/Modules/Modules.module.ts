import { Module } from '@nestjs/common';
import { HealthModule } from './Health/Health.module';
import { SocketModule } from './Socket/Socket.module';
import { VersionModule } from './Version/version.module';

@Module({ imports: [HealthModule, VersionModule, SocketModule] })
export class ModulesModule {}
