import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication';
import { ConfigurationModule } from './configuration';
import { DatabaseModule } from './database';
import { SubjectModules } from './subjects';

@Module({
  imports: [
    ...SubjectModules,
    DatabaseModule,
    AuthenticationModule,
    ConfigurationModule,
  ],
})
export class AppModule {}
