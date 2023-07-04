import { Module } from '@nestjs/common';
import { AuthService } from './application';
import { AuthController } from './presentation';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
