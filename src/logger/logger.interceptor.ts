import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, user, headers } = request;
    const ip =
      headers['x-real-ip'] ||
      headers['x-forwarded-for'] ||
      request.connection?.remoteAddress;
    const agent = headers['user-agent'];
    const referer = headers['referer'];

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - start;
        const message = JSON.stringify({
          user,
          ip,
          agent,
          referer,
        });

        Logger.log(`${method} ${url} - ${time}ms\n\t${message}`);
      }),
    );
  }
}
