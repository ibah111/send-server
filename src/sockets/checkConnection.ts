import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import client from "src/utils/client";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class checkConnection {
  @SubscribeMessage("version")
  check_client(@MessageBody() version: string) {
    if (version !== client("version")) return { event: "new_version" };
  }
}
