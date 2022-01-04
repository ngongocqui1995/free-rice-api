import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/system')
  getSystem() {
    return this.appService.getSystem();
  }

  @Get('/job')
  getJob() {
    return this.appService.getJob();
  }

  @Get('/job/:value')
  setJob(@Param('value') value) {
    return this.appService.setJob(value);
  }
}
