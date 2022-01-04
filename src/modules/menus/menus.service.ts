import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, CrudService, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import to from 'await-to-js';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { BaseService } from 'src/common/base.service';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';
import { Connection, Not } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService extends TypeOrmCrudService<Menu> {
  model_name: string = ENUM_MODEL.MENU;
  status_name: string = ENUM_MODEL.STATUS;

  constructor(
    @InjectRepository(Menu) repo, 
    private checkService: BaseService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<Menu> {
    return this;
  }

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateMenuDto,
    @I18nLang() lang: string
  ) {
    const urlExist = await this.findOne({
      where: { url: dto.url, type: dto.type, id: Not(id) },
    });
    this.checkService.checkUrlExist(!!urlExist);

    const [err, res] = await to(
      this.updateOne(req, <Menu>dto),
    );
    if (err) this.checkService.throwErrorSystem(err.message);
    return {
      data: res,
      message: await this.checkService.i18n.translate('messages.ACTION.UPDATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async replaceOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateMenuDto,
    @I18nLang() lang: string
  ) {
    const urlExist = await this.findOne({
      where: { url: dto.url, type: dto.type, id: Not(id) },
    });
    this.checkService.checkUrlExist(!!urlExist);

    const [err] = await to(
      this.replaceOne(req, <Menu>dto),
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
    @ParsedBody() dto: CreateMenuDto,
    @I18nLang() lang: string
  ) {
    const urlExist = await this.findOne({
      where: { url: dto.url, type: dto.type },
    });
    this.checkService.checkUrlExist(!!urlExist);

    const [err] = await to(this.createOne(req, <Menu>dto));
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
      .update(Menu)
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
