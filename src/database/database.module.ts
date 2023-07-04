import { Global, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { adminConfig } from 'src/configuration';
import { ConfigType } from '@nestjs/config';
import { hashSync } from 'bcrypt';
import { UserRole } from '@prisma/client';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule implements OnApplicationBootstrap {
  constructor(
    @Inject(adminConfig.KEY)
    private readonly _adminConfig: ConfigType<typeof adminConfig>,
    private readonly _prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this._createAdmin();
    } catch (e) {
      console.error(e);
    }
  }

  private async _createAdmin() {
    const { email, password, name } = this._adminConfig;
    const exUser = await this._prisma.user.findUnique({ where: { email } });
    if (!exUser) {
      const data = {
        role: UserRole.admin,
        email,
        password: hashSync(password, 12),
        name,
      };
      await this._prisma.user.create({ data });
    }
  }
}
