import { I18nService } from 'nestjs-i18n';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse() as any;

    if (message.key) {
      message = await this.i18n.translate(message.key, {
        lang: ctx.getRequest().i18nLang,
        args: message?.args,
      });
      response.status(statusCode).json({ statusCode, message });
      return;
    }

    if (message?.message && Array.isArray(message?.message)) {
      message = await Promise.all(message?.message.map(async (it) => {
        return await this.i18n.translate(it, {
          lang: ctx.getRequest().i18nLang,
        });
      }));  
      response.status(statusCode).json({ statusCode, message });
      return;
    }

    if (message?.message && !Array.isArray(message?.message)) {
      message = await this.i18n.translate(message?.message, {
        lang: ctx.getRequest().i18nLang,
      });
      response.status(statusCode).json({ statusCode, message });
      return;
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
