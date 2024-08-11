import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CustomResponseObjectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        return {
            statusCode,
            message: statusCode >= 400 ? 'Error' : 'Success',
            error: statusCode >= 400 ? response.message : null,
            timestamp: Date.now(),
            version: 'v1',
            path: request.url,
            data: data
        };
    }),
    
      catchError(err => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode,
          message: err.message || 'Internal server error',
          error: err.name || 'Error',
          timestamp: Date.now(),
          version: 'v2',
          path: request.url,
          data: {},  // Returning an empty object in case of error
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      })
    );
  }
}
