import { Module } from '@nestjs/common';
import { UsersController } from './presentation';
import { UsersService } from './application';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
