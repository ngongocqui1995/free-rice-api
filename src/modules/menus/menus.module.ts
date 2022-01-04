import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { BaseService } from 'src/common/base.service';
import { BaseController } from 'src/common/base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Menu } from './entities/menu.entity';
import { RoleToMenuService } from '../role-to-menu/role-to-menu.service';
import { RoleToMenu } from '../role-to-menu/entities/role-to-menu.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { ValidAddressService } from '../valid-address/valid-address.service';
import { ValidAddress } from '../valid-address/entities/valid-address.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Menu, RoleToMenu, Role, ValidAddress])],
  exports: [TypeOrmModule],
  controllers: [MenusController],
  providers: [MenusService, BaseService, BaseController, RoleToMenuService, RolesService, ValidAddressService]
})
export class MenusModule {}
