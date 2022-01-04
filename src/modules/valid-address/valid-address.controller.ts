import { Controller, Body, Param, UseGuards, Put, ValidationPipe } from '@nestjs/common';
import { ValidAddressService } from './valid-address.service';
import { CreateValidAddressDto } from './dto/create-valid-address.dto';
import { UpdateValidAddressDto } from './dto/update-valid-address.dto';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ValidAddress } from './entities/valid-address.entity';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { RequireRoles } from 'src/auth/decorator/roles.decorator';
import { ROLES } from '../roles/contants/contants';
import { I18nLang } from 'nestjs-i18n';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';

@Crud({
  model: {
    type: ValidAddress,
  },
  dto: {
    create: CreateValidAddressDto,
    update: UpdateValidAddressDto,
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
@ApiTags('Valid Address')
@Controller('valid-address')
export class ValidAddressController implements CrudController<ValidAddress> {
  constructor(
    public service: ValidAddressService, 
    private checkController: BaseController,
  ) {}

  get base(): CrudController<ValidAddress> {
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
    @ParsedBody() dto: CreateValidAddressDto,
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
    @ParsedBody() dto: CreateValidAddressDto,
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
    @ParsedBody() dto: CreateValidAddressDto,
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
    return this.service.updateStatus(id, updateStatusDTO, lang);
  }
}
