import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle standard NestJS HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }

    // Handle RPC errors (object with statusCode/message from microservice)
    if (typeof exception === 'object' && exception !== null) {
      const err = exception as Record<string, unknown>;

      // Direct object: { statusCode: 409, message: '...' }
      if (typeof err.statusCode === 'number' && err.message) {
        return response.status(err.statusCode).json({
          statusCode: err.statusCode,
          message: err.message,
        });
      }

      // Wrapped: { status: 'error', message: { statusCode: 409, message: '...' } }
      if (err.message && typeof err.message === 'object') {
        const inner = err.message as Record<string, unknown>;
        if (typeof inner.statusCode === 'number' && inner.message) {
          return response.status(inner.statusCode).json({
            statusCode: inner.statusCode,
            message: inner.message,
          });
        }
      }

      // Error instance with JSON message string
      if (exception instanceof Error && typeof err.message === 'string') {
        try {
          const parsed = JSON.parse(err.message as string);
          if (parsed.statusCode && parsed.message) {
            return response.status(parsed.statusCode).json({
              statusCode: parsed.statusCode,
              message: parsed.message,
            });
          }
        } catch {
          // not JSON
        }
      }
    }

    // Default fallback
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
