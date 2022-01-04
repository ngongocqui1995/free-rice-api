import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/i18n/exceptions-filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CronjobModule } from './events/cronjob/cronjob.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GlobalService } from './common/global.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: process.env.DEFAULT_LANGUAGE,
      fallbacks: {
        'en-*': 'en',
        'vi-*': 'vi',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    CronjobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GlobalService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
