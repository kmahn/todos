import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BearerTokenService } from 'src/authentication/services';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserProfile } from 'src/types';
import { v4 } from 'uuid';
import { RefreshTokenDto, SignupDto } from '../dto';
import { hashSync } from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private readonly _tokenService: BearerTokenService,
  ) {}

  async createTokens(user: UserProfile) {
    const accessToken = this._tokenService.sign(user);
    const refreshToken = v4();
    const data = { value: refreshToken, userId: user.id };

    await this._prisma.token.create({ data });
    return { accessToken, refreshToken };
  }

  async signup(data: SignupDto) {
    const { email } = data;

    const exUser = await this._prisma.user.findUnique({ where: { email } });
    if (!!exUser) throw new ConflictException();

    data.password = hashSync(data.password, 12);

    await this._prisma.user.create({
      data: { ...data, role: UserRole.member },
    });
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken: value } = dto;
    const row = await this._prisma.token.findUnique({ where: { value } });
    if (!row) throw new UnauthorizedException();

    const { userId: id } = row;
    const user = await this._prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException();

    const payload: UserProfile = {
      id: user.id,
      role: user.role,
    };

    const accessToken = this._tokenService.sign(payload);
    const refreshToken = v4();
    await this._prisma.token.update({
      where: { id: row.id },
      data: { value: refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
