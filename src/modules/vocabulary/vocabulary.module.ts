import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { BaseService } from 'src/common/base.service';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Vocabulary, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, BaseService, ValidAddressService]
})
export class VocabularyModule {}
