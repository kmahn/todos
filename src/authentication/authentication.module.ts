import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from 'src/configuration';
import { BearerTokenService } from './services';
import { Strategies } from './strategies';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [BearerTokenService, ...Strategies],
  exports: [BearerTokenService],
})
export class AuthenticationModule {}
