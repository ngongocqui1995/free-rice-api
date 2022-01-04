import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from 'src/common/base.controller';
import { BaseService } from 'src/common/base.service';
import { GlobalService } from 'src/common/global.service';
import { Vocabulary } from 'src/modules/vocabulary/entities/vocabulary.entity';
import { VocabularyService } from 'src/modules/vocabulary/vocabulary.service';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary])],
  controllers: [],
  providers: [CronjobService, BaseService, GlobalService, BaseController, VocabularyService]
})
export class CronjobModule {}
