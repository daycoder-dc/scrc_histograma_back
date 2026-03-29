import { MessageBody, SubscribeMessage, WebSocketGateway,
  WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  path: "/api/socket.io",
  transports: ["websocket"],
  cors: { origin: "*" } }
)
export class EventGateway {
  @WebSocketServer()
  public readonly socket: Server;

  @SubscribeMessage("event")
  handleEvnet(@MessageBody() data:any) {
    console.log(data);
    return data;
  }
}
