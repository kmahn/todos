import { ConfigFactory } from '@nestjs/config';
import { adminConfig } from './admin.config';
import { jwtConfig } from './jwt.config';

export * from './admin.config';
export * from './jwt.config';

export const load: ConfigFactory[] = [adminConfig, jwtConfig];
