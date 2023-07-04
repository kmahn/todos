import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  exclude<Model, Key extends keyof Model>(
    m: Model,
    keys: Key[],
  ): Omit<Model, Key> {
    return Object.fromEntries(
      Object.entries(m).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<Model, Key>;
  }
}
