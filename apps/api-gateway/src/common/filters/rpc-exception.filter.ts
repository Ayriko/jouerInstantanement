import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface RpcError {
  error?: string;
  message?: string;
  status?: number;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Erreur venant d'un microservice
    const rpcError = exception as RpcError;
    if (rpcError?.status && (rpcError?.error || rpcError?.message)) {
      return response.status(rpcError.status).json({
        statusCode: rpcError.status,
        message: rpcError.error || rpcError.message,
        timestamp: new Date().toISOString(),
      });
    }

    // Erreur HTTP classique
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    // Erreur inattendue
    console.error('Unhandled exception:', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
