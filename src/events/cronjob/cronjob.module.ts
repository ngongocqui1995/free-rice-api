import { Module } from '@nestjs/common';
import { BaseController } from '../../common/base.controller';
import { BaseService } from '../../common/base.service';
import { GlobalService } from '../../common/global.service';
import { CronjobService } from './cronjob.service';

@Module({
  controllers: [],
  providers: [CronjobService, BaseService, GlobalService, BaseController]
})
export class CronjobModule {}
