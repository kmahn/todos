import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma/prisma.service';
import { LoggerInterceptor, logger } from './logger';
import { ExceptionFilter } from './errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });

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
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(3333);
}
bootstrap();
