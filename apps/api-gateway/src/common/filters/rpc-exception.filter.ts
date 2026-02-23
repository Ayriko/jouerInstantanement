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
  status?: number | string;
  statusCode?: number;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Erreur HTTP classique
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    // Erreur venant d'un microservice
    const rpcError = exception as RpcError;

    // Extraire le status code (peut être dans status ou statusCode)
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (typeof rpcError?.statusCode === 'number') {
      statusCode = rpcError.statusCode;
    } else if (typeof rpcError?.status === 'number') {
      statusCode = rpcError.status;
    }

    // Extraire le message
    const message =
      rpcError?.message || rpcError?.error || 'Internal server error';

    // Log pour debug
    console.error('RPC Exception:', exception);

    return response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
