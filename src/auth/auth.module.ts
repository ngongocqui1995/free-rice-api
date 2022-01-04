import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BaseService } from '../common/base.service';
import { PasswordHasherService } from './password-hasher/password-hasher.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { BaseController } from 'src/common/base.controller';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RolesService } from 'src/modules/roles/roles.service';
import { ValidAddressService } from 'src/modules/valid-address/valid-address.service';
import { ValidAddress } from 'src/modules/valid-address/entities/valid-address.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([User, Role, ValidAddress]),
  ],
  exports: [TypeOrmModule, AuthService],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    BaseService,
    BaseController,
    PasswordHasherService,
    JwtStrategyService,
    RolesService,
    ValidAddressService,
  ],
})
export class AuthModule {}
