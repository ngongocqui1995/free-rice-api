import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import to from 'await-to-js';
import axios from 'axios';
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

  async setJob(value: String) {
    const { server } = this.globalService.getJob();
    const [err, findAnswer]: any = await to(axios.get(`${server}/account`));
    if (err) throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err.message }, HttpStatus.BAD_REQUEST);;

    this.globalService.setJob(String(value), findAnswer);
    return true;
  }
}
