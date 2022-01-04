import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Permission } from './entities/permission.entity';
import { BaseService } from 'src/common/base.service';
import { BaseController } from 'src/common/base.controller';
import { RoleToMenuService } from '../role-to-menu/role-to-menu.service';
import { RoleToMenu } from '../role-to-menu/entities/role-to-menu.entity';
import { MenusService } from '../menus/menus.service';
import { RolesService } from '../roles/roles.service';
import { Menu } from '../menus/entities/menu.entity';
import { Role } from '../roles/entities/role.entity';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Permission, RoleToMenu, Menu, Role, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [PermissionController],
  providers: [PermissionService, BaseService, BaseController, RoleToMenuService, MenusService, RolesService, ValidAddressService]
})
export class PermissionModule {}
