import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {

  wsClients: Socket[] = [];

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    this.broadcast('events', data)
  }

  broadcast(event, value: any) {
    for (const client of this.wsClients) {
      client.emit(event, value)
    }
  }

  afterInit(server: any) {
    // console.log('afterInit')
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (this.wsClients.length > 10) {
      client.emit('events', '입장 인원을 초과했습니다')
    } else {
      this.wsClients.push(client)
    }
  }

  handleDisconnect(client: any) {
    this.wsClients.splice(this.wsClients.indexOf(client), 1)
  }

}
