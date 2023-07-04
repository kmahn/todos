import { Module } from '@nestjs/common';
import { AuthController } from './presentation';
import { AuthService } from './application';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
