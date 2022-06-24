import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { VersionService } from './version/version.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class checkConnection {
  constructor(private readonly versionService:VersionService){}
  @SubscribeMessage('version')
  check_client(@MessageBody() version: string) {
    if (version !== this.versionService.version) return { event: 'new_version' };
  }
}
