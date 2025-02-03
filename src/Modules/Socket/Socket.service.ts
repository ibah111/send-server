import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { VersionService } from '../Version/version.service';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService {
  constructor(private readonly versionService: VersionService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('version')
  check_client(@MessageBody() version: string) {
    if (String(version) !== String(this.versionService.version))
      return { event: 'new_version' };
  }
  connections(name: string): HealthIndicatorResult {
    const result: HealthIndicatorResult = {
      [name]: {
        status: 'up',
        'Кол-во подключений': this.server.engine.clientsCount,
      },
    };
    return result;
  }

  @SubscribeMessage('server_event')
  send_event(event: string, data?: Record<string, string>) {
    return {
      event,
      data,
    };
  }
}
