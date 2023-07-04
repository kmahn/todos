import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication';
import { ConfigurationModule } from './configuration';
import { DatabaseModule } from './database';
import { SubjectModules } from './subjects';
import { SocketModule } from './socket';

@Module({
  imports: [
    ...SubjectModules,
    AuthenticationModule,
    ConfigurationModule,
    DatabaseModule,
    SocketModule,
  ],
})
export class AppModule {}
