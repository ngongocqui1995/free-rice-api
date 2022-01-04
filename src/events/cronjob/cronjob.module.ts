import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from 'src/common/base.controller';
import { BaseService } from 'src/common/base.service';
import { GlobalService } from 'src/common/global.service';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [CronjobService, BaseService, GlobalService, BaseController]
})
export class CronjobModule {}
