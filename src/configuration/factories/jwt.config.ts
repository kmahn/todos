import { registerAs } from '@nestjs/config';
import { ConfigKey } from './config-key';

export const jwtConfig = registerAs(ConfigKey.JWT, () => ({
  secret: process.env.JWT_SECRET,
}));
