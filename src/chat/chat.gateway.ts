import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'dgram';

function shuffle(array: Array<any>) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
  wsClients: Socket[] = [];
  nicknames: string[] = [
    '강철 남자', '강한 시금치', '망치의 신',
    '착한 거미', '이상한 의사',
  ]
  constructor() {
    shuffle(this.nicknames)

  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    const clientIndex = this.wsClients.indexOf(client)
    for (let i = 0; i < this.wsClients.length; i++) {
      this.wsClients[i].emit('message', { owner: this.nicknames[clientIndex], value: data })
    }
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
    if (this.wsClients.length > 5) {
      client.emit('message', '입장 인원을 초과했습니다')
    } else {
      this.wsClients.push(client)
    }
  }

  handleDisconnect(client: any) {
    this.wsClients.splice(this.wsClients.indexOf(client), 1)
  }

}
