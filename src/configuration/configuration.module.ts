import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './validation';
import { load } from './factories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
