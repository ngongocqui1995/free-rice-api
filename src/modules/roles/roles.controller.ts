import { Body, Controller, Param, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { BaseController } from '../../common/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { I18nLang } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { ENUM_MODEL, ENUM_STATUS } from 'src/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { ROLES } from './contants/contants';
import { RequireRoles } from 'src/auth/decorator/roles.decorator';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';

@ApiTags('Roles')
@Crud({
  model: {
    type: Role,
  },
  dto: {
    create: CreateRoleDto,
    update: UpdateRoleDto,
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
@Controller('roles')
export class RolesController implements CrudController<Role> {
  model_name: string = ENUM_MODEL.ROLE;

  constructor(
    public service: RolesService, 
    private userService: UsersService,
    private checkController: BaseController,
  ) {}

  get base(): CrudController<Role> {
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
    @ParsedBody() dto: CreateRoleDto,
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
    @ParsedBody() dto: CreateRoleDto,
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
    @ParsedBody() dto: CreateRoleDto,
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
    const findUser = await this.userService.findOne({ where: { role: id, status: ENUM_STATUS.ACTIVE } });
    this.checkController.checkStatusRole(!!findUser, updateStatusDTO.status);
    return this.service.updateStatus(id, updateStatusDTO, lang);
  }
}
