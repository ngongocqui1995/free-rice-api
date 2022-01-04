import { Controller, Get, Put, Query } from '@nestjs/common';
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

  @Put('/job/:value')
  setJob(@Query('value') value) {
    return this.appService.setJob(value);
  }
}
