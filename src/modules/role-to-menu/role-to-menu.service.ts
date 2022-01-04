import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, CrudService, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import to from 'await-to-js';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { BaseService } from 'src/common/base.service';
import { Connection, Not } from 'typeorm';
import { MenusService } from '../menus/menus.service';
import { Permission } from '../permission/entities/permission.entity';
import { RolesService } from '../roles/roles.service';
import { CreateRoleToMenuDto } from './dto/create-role-to-menu.dto';
import { RoleToMenu } from './entities/role-to-menu.entity';

@Injectable()
export class RoleToMenuService extends TypeOrmCrudService<RoleToMenu> {
  model_name: string = ENUM_MODEL.MENU;

  constructor(
    @InjectRepository(RoleToMenu) repo, 
    private checkService: BaseService,
    private menuService: MenusService,
    private roleService: RolesService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<RoleToMenu> {
    return this;
  }

  async deleteOneBase(
    @ParsedRequest() req: CrudRequest,
    @I18nLang() lang: string
  ) {
    const [err] = await to(this.deleteOne(req));
    if (err) this.checkService.throwErrorSystem(err.message);
    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.DELETE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    const menuExist = await this.menuService.findOne({
      where: { id: dto.menu },
    });
    this.checkService.checkMenuNotExist(!!menuExist);

    const roleExist = await this.roleService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);

    const register = await this.findOne({
      where: { menu: dto.menu, role: dto.role, id: Not(id) },
    });
    this.checkService.checkRoleMenuExist(!!register);

    const [err] = await to(
      this.updateOne(req, <RoleToMenu>dto),
    );
    if (err) this.checkService.throwErrorSystem(err.message);
    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.UPDATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async replaceOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    const menuExist = await this.menuService.findOne({
      where: { id: dto.menu },
    });
    this.checkService.checkMenuNotExist(!!menuExist);

    const roleExist = await this.roleService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);

    const register = await this.findOne({
      where: { menu: dto.menu, role: dto.role, id: Not(id) },
    });
    this.checkService.checkRoleMenuExist(!!register);

    const [err] = await to(
      this.replaceOne(req, <RoleToMenu>dto),
    );
    if (err) this.checkService.throwErrorSystem(err.message);
    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.UPDATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async createOneBase(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleToMenuDto,
    @I18nLang() lang: string
  ) {
    const menuExist = await this.menuService.findOne({
      where: { id: dto.menu },
    });
    this.checkService.checkMenuNotExist(!!menuExist);

    const roleExist = await this.roleService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);

    const register = await this.findOne({
      where: { menu: dto.menu, role: dto.role },
    });
    this.checkService.checkRoleMenuExist(!!register);

    const [err] = await to(this.createOne(req, <RoleToMenu>dto));
    if (err) this.checkService.throwErrorSystem(err.message);

    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.CREATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }
}
