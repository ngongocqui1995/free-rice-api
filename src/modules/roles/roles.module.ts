import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { BaseService } from '../../common/base.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PasswordHasherService } from 'src/auth/password-hasher/password-hasher.service';
import { BaseController } from 'src/common/base.controller';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Role, User, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [RolesController],
  providers: [UsersService, RolesService, BaseService, PasswordHasherService, BaseController, ValidAddressService],
})
export class RolesModule {}
