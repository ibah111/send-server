import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { SequelizeHealthIndicator } from '@tools/terminus-indicators';
import server from 'src/utils/server';
@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: SequelizeHealthIndicator,
  ) {}
  async check() {
    return await this.health.check([
      async () =>
        await this.http.responseCheck<HealthCheckResult>(
          'templates',
          server('fastreport') + '/health',
          (res) => res.data.status === 'ok',
        ),
      async () => await this.db.pingCheck('database'),
    ]);
  }
}
