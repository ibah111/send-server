import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { VersionService } from '../Version/version.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService {
  constructor(private readonly versionService: VersionService) {}
  @SubscribeMessage('version')
  check_client(@MessageBody() version: string) {
    if (String(version) !== String(this.versionService.version))
      return { event: 'new_version' };
  }
}
