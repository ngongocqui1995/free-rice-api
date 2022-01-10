import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from '../../common/base.controller';
import { BaseService } from '../../common/base.service';
import { GlobalService } from '../../common/global.service';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [CronjobService, BaseService, GlobalService, BaseController]
})
export class CronjobModule {}
