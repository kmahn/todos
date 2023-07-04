import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const LoginRequired = applyDecorators(UseGuards(AuthGuard('jwt')));
