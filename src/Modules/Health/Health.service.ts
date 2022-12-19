import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import {
  SequelizeHealthIndicator,
  SmbIndicator,
} from '@tools/terminus-indicators';
import server from 'src/utils/server';
@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: SequelizeHealthIndicator,
    private readonly smb: SmbIndicator,
  ) {}
  check() {
    return this.health.check([
      () =>
        this.http.responseCheck<HealthCheckResult>(
          'templates',
          server('fastreport') + '/health',
          (res) => res.data.status === 'ok',
        ),
      () => this.db.pingCheck('database', { connection: 'contact' }),
      () => this.smb.check('smb', 'DocAttach'),
    ]);
  }
}
