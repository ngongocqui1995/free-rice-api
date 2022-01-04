import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Role } from './entities/role.entity';
import {
  CrudRequest,
  ParsedBody,
  ParsedRequest,
  CrudService,
} from '@nestjsx/crud';
import { CreateRoleDto } from './dto/create-role.dto';
import { BaseService } from '../../common/base.service';
import to from 'await-to-js';
import { I18nLang } from 'nestjs-i18n';
import { Connection, Not } from 'typeorm';
import { ENUM_MODEL } from 'src/common';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  status_name: string = ENUM_MODEL.STATUS;
  model_name: string = ENUM_MODEL.ROLE;

  constructor(
    @InjectRepository(Role) repo, 
    private checkService: BaseService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<Role> {
    return this;
  }

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateRoleDto,
    @I18nLang() lang: string
  ) {
    const codeExist = await this.findOne({
      where: { code: dto.code, id: Not(id) },
    });
    this.checkService.checkCodeExist(!!codeExist);

    const [err] = await to(
      this.updateOne(req, <Role>dto),
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
    @ParsedBody() dto: CreateRoleDto,
    @I18nLang() lang: string
  ) {
    const codeExist = await this.findOne({
      where: { code: dto.code, id: Not(id) },
    });
    this.checkService.checkCodeExist(!!codeExist);

    const [err] = await to(
      this.replaceOne(req, <Role>dto),
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
    @ParsedBody() dto: CreateRoleDto,
    @I18nLang() lang: string
  ) {
    const codeExist = await this.findOne({
      where: { code: dto.code },
    });
    this.checkService.checkCodeExist(!!codeExist);

    const [err] = await to(this.createOne(req, <Role>dto));
    if (err) this.checkService.throwErrorSystem(err.message);

    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.CREATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async updateStatus(id: string, updateStatusDTO: UpdateStatusDTO, @I18nLang() lang: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .update(Role)
      .set({ status: updateStatusDTO.status })
      .where("id = :id", { id })
      .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.checkService.throwErrorSystem(err.message);
    } finally {
      await queryRunner.release();
    }
    
    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.UPDATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.status_name) }]
      }),
    }
  }
}
