import { Module } from '@nestjs/common';
import { SocketGateway } from './gateways';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
