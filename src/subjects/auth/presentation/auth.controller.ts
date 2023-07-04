import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/authentication';
import { UserProfile } from 'src/types';
import { AuthService } from '../application';
import { RefreshTokenDto, SignupDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@User() user: UserProfile) {
    return this._authService.createTokens(user);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    await this._authService.signup(dto);
  }

  @HttpCode(200)
  @Post('token/refresh')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this._authService.refreshToken(dto);
  }
}
