import { Module } from '@nestjs/common';
import { RoleToMenuService } from './role-to-menu.service';
import { RoleToMenuController } from './role-to-menu.controller';
import { RolesService } from '../roles/roles.service';
import { BaseService } from 'src/common/base.service';
import { MenusService } from '../menus/menus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleToMenu } from './entities/role-to-menu.entity';
import { Menu } from '../menus/entities/menu.entity';
import { Role } from '../roles/entities/role.entity';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([RoleToMenu, Menu, Role, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [RoleToMenuController],
  providers: [RoleToMenuService, RolesService, BaseService, MenusService, ValidAddressService]
})
export class RoleToMenuModule {}
