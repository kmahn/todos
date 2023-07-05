import { Module } from '@nestjs/common';
import { UsersService } from './application';
import { UsersController } from './presentation';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
