import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService 
    ) {}
    
  async handleConnection(client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client, payload.id );

    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log('Cliente conectado: ', client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket ) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient( client.id );
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    // console.log(client.id, payload);

    // client.emit('messages-from-server', {
    //   fullName: "Soy Yo!",
    //   message: payload.message || 'no-message!!'
    // })

    //! Emitir a todos menos al cliente que envía
    // client.broadcast.emit('messages-from-server', {
    //   fullName: "Soy Yo!",
    //   message: payload.message || 'no-message!!'
    // })

    //! Emitir a todos
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })

  }


}
