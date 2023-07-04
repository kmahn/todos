import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compareSync } from 'bcrypt';
import { Strategy } from 'passport-local';
import { PrismaService } from 'src/database';
import { UserProfile } from 'src/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _prisma: PrismaService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserProfile> {
    const user = await this._prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException();
    if (!compareSync(password, user.password))
      throw new UnauthorizedException();
    const { id, role } = user;
    return { id, role };
  }
}
