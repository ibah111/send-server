import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './Health.controller';
import { HealthService } from './Health.service';
import { SequelizeHealthIndicator } from './sequelize.Health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService, SequelizeHealthIndicator],
})
export class HealthModule {}
