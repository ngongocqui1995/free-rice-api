import { Controller, Body, Param, UseGuards } from '@nestjs/common';
import { RoleToMenuService } from './role-to-menu.service';
import { CreateRoleToMenuDto } from './dto/create-role-to-menu.dto';
import { UpdateRoleToMenuDto } from './dto/update-role-to-menu.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { RoleToMenu } from './entities/role-to-menu.entity';
import { I18nLang } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { ROLES } from '../roles/contants/contants';
import { RequireRoles } from 'src/auth/decorator/roles.decorator';

@ApiTags('Role-To-Menu')
@Crud({
  model: {
    type: RoleToMenu,
  },
  dto: {
    create: CreateRoleToMenuDto,
    update: UpdateRoleToMenuDto,
  },
  query: {
    join: {
      permissions: {
        allow: undefined
      },
      role: {
        allow: undefined
      },
      menu: {
        allow: undefined
      }
    }
  },
  routes: {
    exclude: ['createManyBase']
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller('role-to-menu')
export class RoleToMenuController implements CrudController<RoleToMenu> {
  constructor(public service: RoleToMenuService) {}

  get base(): CrudController<RoleToMenu> {
    return this;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getManyBase(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override('updateOneBase')
  coolFunction(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    return this.service.updateOneBase(id, req, dto, lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override('replaceOneBase')
  awesomePUT(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    return this.service.replaceOneBase(id, req, dto, lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
    @I18nLang() lang: string
  ) {
    return this.service.deleteOneBase(req, lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    return this.service.createOneBase(req, dto, lang);
  }
}
