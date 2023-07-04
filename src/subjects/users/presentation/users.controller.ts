import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LoginRequired, User } from 'src/authentication';
import { UserProfile } from 'src/types';
import { UsersService } from '../application';
import { OperatorRoleRequired } from 'src/authentication/decorators/roles-required.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @LoginRequired
  @Get('me')
  findMe(@User() user: UserProfile) {
    return this._usersService.findUser(user.id);
  }

  @OperatorRoleRequired
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this._usersService.findUser(id);
  }
}
