import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { BaseService } from '../../common/base.service';
import { PasswordHasherService } from '../../auth/password-hasher/password-hasher.service';
import { ConfigModule } from '@nestjs/config';
import { BaseController } from 'src/common/base.controller';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entities/role.entity';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User, Role, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService, RolesService, BaseService, PasswordHasherService, BaseController, ValidAddressService],
})
export class UsersModule {}
