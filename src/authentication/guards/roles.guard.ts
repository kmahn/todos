import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    const request: any = context.switchToHttp().getRequest();
    const user: UserProfile | undefined = request.user;
    if (!user || !roles.includes(user.role)) throw new ForbiddenException();

    return true;
  }
}
