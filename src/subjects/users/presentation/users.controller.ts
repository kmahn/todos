import { Controller, Get } from '@nestjs/common';
import { LoginRequired, User } from 'src/authentication';
import { UserProfile } from 'src/types';
import { UsersService } from '../application';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @LoginRequired
  @Get('me')
  findMe(@User() user: UserProfile) {
    return this._usersService.findMe(user.id);
  }
}
