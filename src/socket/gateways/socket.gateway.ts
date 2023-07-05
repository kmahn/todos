import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { asyncScheduler, filter, from, scheduled } from 'rxjs';
import { Namespace, Server, Socket } from 'socket.io';
import { BearerTokenService } from 'src/authentication/services';
import { PrismaService } from 'src/database';
import { ErrorMessage } from 'src/errors/messages';

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;

  constructor(
    private readonly _tokenService: BearerTokenService,
    private readonly _prisma: PrismaService,
  ) {}

  emit(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  emitToUser(event: string, payload: any, userId: number) {
    const nsp: Namespace = this.server.of('/');
    const { sockets } = nsp;

    scheduled(from(sockets), asyncScheduler)
      .pipe(filter(([, socket]) => (socket as any).user.id === userId))
      .subscribe(([id]) => this.server.to(id).emit(event, payload));
  }

  emitToRoom(event: string, payload: any, room: string, socket?: Socket) {
    !!socket
      ? socket.to(room).emit(event, payload)
      : this.server.in(room).emit(event, payload);
  }

  disconnectUser(userId: string) {
    const nsp: Namespace = this.server.of('/');
    const { sockets } = nsp;
    scheduled(from(sockets), asyncScheduler)
      .pipe(filter(([, socket]) => (socket as any).user._id === userId))
      .subscribe(([, socket]) => socket.disconnect());
  }

  handleConnection(socket: Socket) {
    socket.join('chat_room');
    Logger.debug(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(socket: Socket): any {
    Logger.debug(`${socket.id} 소켓 연결 해제`);
  }

  afterInit(server: Server) {
    this.server = server;

    server.use(async (client: Socket, next: (err?: WsException) => void) => {
      const { token } = client.handshake.auth;
      if (!token) return next(new WsException(ErrorMessage.UNAUTHORIZED));
      try {
        const { id } = this._tokenService.verify(token);
        const user = await this._prisma.user.findUnique({ where: { id } });
        if (!user) return next(new WsException(ErrorMessage.USER_NOT_FOUND));
        (client as any).user = user;
        next();
      } catch (e) {
        Logger.error(e.message);
        next(new WsException(e.message));
      }
    });

    server.on('create-room', (room, id) =>
      Logger.debug(`"Room ${id}가 ${room}"을 생성했습니다.`),
    );
    server.on('join-room', (room, id) =>
      Logger.debug(`"Socket ${id}"가 "Room ${room}에 참여하였습니다.`),
    );
    server.on('leave-room', (room, id) =>
      Logger.debug(`"Socket ${id}"가 "Room ${room}에서 나갔습니다.`),
    );
    server.on('delete-room', (room) =>
      Logger.debug(`"Room ${room}"이 삭제되었습니다.`),
    );
  }
}
