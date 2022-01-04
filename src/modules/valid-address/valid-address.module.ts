import { Module } from '@nestjs/common';
import { ValidAddressService } from './valid-address.service';
import { ValidAddressController } from './valid-address.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidAddress } from './entities/valid-address.entity';
import { BaseService } from 'src/common/base.service';
import { BaseController } from 'src/common/base.controller';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [ValidAddressController],
  providers: [ValidAddressService, BaseService, BaseController]
})
export class ValidAddressModule {}
