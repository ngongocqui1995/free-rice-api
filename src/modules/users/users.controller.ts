import { Controller, Put, ValidationPipe, Body, Param, UseGuards, Request, Post } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from '../../common/base.controller';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { RequireRoles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from '../roles/contants/contants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { CreateCustomerDto } from './dto/create-cutomer.dto';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';
import { ValidAddressGuard } from 'src/auth/guards/valid-address-guard';

@Crud({
  model: {
    type: User,
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
  query: {
    join: {
      role: {
        allow: undefined
      }
    }
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
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  model_name: string = ENUM_MODEL.USER;

  constructor(
    public service: UsersService,
    private checkController: BaseController,
  ) {}

  get base(): CrudController<User> {
    return this;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @Override()
  getMany(
    @ParsedRequest() req,
  ) {
    return this.base.getManyBase(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
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
    @ParsedBody() dto: CreateUserDto,
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
    @ParsedBody() dto: CreateUserDto,
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
    @ParsedBody() dto: CreateUserDto,
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
  async updateStatus(@Param('id') id: string, @Request() req, @Body(ValidationPipe) updateStatusDTO: UpdateStatusDTO, @I18nLang() lang: string) {
    this.checkController.checkStatusUser(id, req?.user?.id);
    return this.service.updateStatus(id, updateStatusDTO, lang);
  }

  @Put('update/change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(ROLES.ROLE_ADMIN)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  async changePassword(@Request() req, @Body(ValidationPipe) changePasswordDTO: ChangePasswordDTO, @I18nLang() lang: string) {
    return this.service.changePassword(req, changePasswordDTO, lang);
  }
}
