import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
  ExceptionFilter as NestExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorMessage } from '../messages';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { message } = request.authInfo || {};
    const error = exception;

    if (message === 'jwt expired') {
      exception = new UnauthorizedException(ErrorMessage.ACCESS_TOKEN_EXPIRED);
    } else if (message === 'No auth token') {
      exception = new UnauthorizedException();
    } else if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException(error);
    }

    const { method, url, body, user, headers } = request;
    const ip =
      headers['x-real-ip'] ||
      headers['x-forwarded-for'] ||
      request.connection?.remoteAddress;
    const agent = headers['user-agent'];
    const referer = headers['referer'];
    const loggingMessage = JSON.stringify({
      user,
      body,
      ip,
      agent,
      referer,
      error: exception,
    });

    const statusCode = (exception as HttpException).getStatus();
    Logger.error(
      `${method} ${url} (${statusCode}) - ${exception.message}\n\t${loggingMessage}`,
    );

    if (process.env.NODE_ENV === 'development') console.error(error);

    response.status(statusCode).json(exception);
  }
}
