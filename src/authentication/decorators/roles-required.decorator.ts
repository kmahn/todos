import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../guards';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);

export function RolesRequired(...roles: UserRole[]) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard('jwt'), RolesGuard));
}

export const OperatorRoleRequired = RolesRequired('admin');
