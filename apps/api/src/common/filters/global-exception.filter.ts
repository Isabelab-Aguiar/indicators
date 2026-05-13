import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const { status, message } = this.resolveException(exception)

    this.logger.error({
      message,
      path: request.url,
      method: request.method,
      statusCode: status,
    })

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }

  private resolveException(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      const message =
        typeof response === 'object' && 'message' in response
          ? Array.isArray((response as { message: unknown }).message)
            ? (response as { message: string[] }).message.join(', ')
            : String((response as { message: unknown }).message)
          : exception.message

      return { status: exception.getStatus(), message }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    }
  }
}
