import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
