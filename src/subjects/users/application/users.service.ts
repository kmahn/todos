import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database';

@Injectable()
export class UsersService {
  constructor(private readonly _prisma: PrismaService) {}

  async findMe(id: number) {
    const user = await this._prisma.user.findUnique({ where: { id } });
    return this._prisma.exclude(user, ['password']);
  }
}
