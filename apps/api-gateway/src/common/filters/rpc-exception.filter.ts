import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

function buildErrorPayload(statusCode: number, message: unknown, error?: unknown) {
  const payload: Record<string, unknown> = { statusCode, message };
  if (error) payload.error = error;
  return payload;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HttpException (ValidationPipe, guards, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }

    if (typeof exception === 'object' && exception !== null) {
      const err = exception as Record<string, unknown>;

      // Direct: { statusCode: 4xx, message: '...' | [...], error?: '...' }
      if (typeof err.statusCode === 'number' && err.message) {
        return response.status(err.statusCode).json(buildErrorPayload(err.statusCode, err.message, err.error));
      }

      // Wrappé: { status: 'error', message: { statusCode: 4xx, message: '...' } }
      if (err.message && typeof err.message === 'object' && !Array.isArray(err.message)) {
        const inner = err.message as Record<string, unknown>;
        if (typeof inner.statusCode === 'number' && inner.message) {
          return response.status(inner.statusCode).json(buildErrorPayload(inner.statusCode, inner.message, inner.error));
        }
      }

      // Error avec message JSON stringifié
      if (exception instanceof Error && typeof err.message === 'string') {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.statusCode && parsed.message) {
            return response.status(parsed.statusCode).json(buildErrorPayload(parsed.statusCode, parsed.message, parsed.error));
          }
        } catch { /* not JSON */ }
      }
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
