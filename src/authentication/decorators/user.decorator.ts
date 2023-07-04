import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserProfile } from 'src/types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserProfile => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
