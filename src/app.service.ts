import { Injectable } from '@nestjs/common';
import { GlobalService } from './common/global.service';

@Injectable()
export class AppService {
  constructor(
    private globalService: GlobalService,
  ) {}

  getHello(): string {
    return 'Chào mừng bạn đến với Free Rice API!';
  }

  getSystem() {
    return this.globalService.getSystem();
  }

  getJob() {
    return this.globalService.getJob();
  }

  setJob(value: String) {
    this.globalService.setJob(String(value));
    return true;
  }
}
