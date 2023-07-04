import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[] = []) => {
        return new BadRequestException({
          data: errors.map((error) => ({
            name: error.property,
            value: error.value,
            constraints: error.constraints,
          })),
        });
      },
    }),
  );

  await app.listen(3333);
}
bootstrap();
