import { Controller, Body, Param, UseGuards, Put, ValidationPipe } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { BaseController } from 'src/common/base.controller';
import { I18nLang } from 'nestjs-i18n';
import { RoleToMenuService } from '../role-to-menu/role-to-menu.service';
import { ENUM_STATUS } from 'src/common';
import { SelectQueryBuilder } from 'typeorm';
import { RoleToMenu } from '../role-to-menu/entities/role-to-menu.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { ROLES } from '../roles/contants/contants';
import { RequireRoles } from 'src/auth/decorator/roles.decorator';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';

@ApiTags('Permissions')
@Crud({
  model: {
    type: Permission,
  },
  dto: {
    create: CreatePermissionDto,
    update: UpdatePermissionDto,
  },
  routes: {
    exclude: ['deleteOneBase', 'createManyBase']
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller('permissions')
export class PermissionController implements CrudController<Permission> {
  constructor(
    public service: PermissionService,
    private roleToMenuService: RoleToMenuService,
    private checkController: BaseController,
  ) {}

  get base(): CrudController<Permission> {
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
    @ParsedBody() dto: CreatePermissionDto,
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
    @ParsedBody() dto: CreatePermissionDto,
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
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreatePermissionDto,
    @I18nLang() lang: string
  ) {
    return this.service.createOneBase(req, dto, lang);
  }

  @Put('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: String,
    example: '1',
    description: 'Id',
  })
  @ApiResponse({ status: 200, type: UpdateStatusDTO, description: 'Success' })
  async updateStatus(@Param('id') id: string, @Body(ValidationPipe) updateStatusDTO: UpdateStatusDTO, @I18nLang() lang: string) {
    const findRole = await this.roleToMenuService.findOne({ 
      join: { 
        alias: 'roleToMenu', 
        leftJoinAndSelect: { 
          role: 'roleToMenu.role',
          permissions: 'roleToMenu.permissions'
        }
      },
      where: (qb: SelectQueryBuilder<RoleToMenu>) => {
        qb.where('role.status = :status', { status: ENUM_STATUS.ACTIVE })
        .andWhere('permissions.id = :id', { id })
      },
    });
    this.checkController.checkStatusPermission(!!findRole, updateStatusDTO.status);
    return this.service.updateStatus(id, updateStatusDTO, lang);
  }
}
