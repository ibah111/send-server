import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { SequelizeHealthIndicator } from '@tools/terminus-indicators';
import server from 'src/utils/server';
import { SMBService } from '../Smb/Smb.service';
import { SocketService } from '../Socket/Socket.service';
@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: SequelizeHealthIndicator,
    private readonly socket: SocketService,
    private readonly smb: SMBService,
  ) {}
  check() {
    return this.health.check([
      () => this.socket.connections('sockets'),
      () =>
        this.http.responseCheck<HealthCheckResult>(
          'templates',
          server('fastreport') + '/health',
          (res) => res.data.status === 'ok',
        ),
      () => this.db.pingCheck('database_contact', { connection: 'contact' }),
      () => this.db.pingCheck('database_local', { connection: 'local' }),
      () => this.smb.getHealth('smb'),
    ]);
  }
}
