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
import { CreateValidAddressDto } from './dto/create-valid-address.dto';
import { ValidAddress } from './entities/valid-address.entity';

@Injectable()
export class ValidAddressService extends TypeOrmCrudService<ValidAddress> {
  status_name: string = ENUM_MODEL.STATUS;
  model_name: string = ENUM_MODEL.VALID_ADDRESS;

  constructor(
    @InjectRepository(ValidAddress) repo, 
    private checkService: BaseService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<ValidAddress> {
    return this;
  }

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateValidAddressDto,
    @I18nLang() lang: string
  ) {
    const hostExist = await this.findOne({
      where: { host: dto.host, id: Not(id) },
    });
    this.checkService.checkHostExist(!!hostExist);

    const [err] = await to(
      this.updateOne(req, <ValidAddress>dto),
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
    @ParsedBody() dto: CreateValidAddressDto,
    @I18nLang() lang: string
  ) {
    const hostExist = await this.findOne({
      where: { host: dto.host, id: Not(id) },
    });
    this.checkService.checkHostExist(!!hostExist);

    const [err] = await to(
      this.replaceOne(req, <ValidAddress>dto),
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
    @ParsedBody() dto: CreateValidAddressDto,
    @I18nLang() lang: string
  ) {
    const hostExist = await this.findOne({
      where: { host: dto.host },
    });
    this.checkService.checkHostExist(!!hostExist);

    const [err] = await to(this.createOne(req, <ValidAddress>dto));
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
      .update(ValidAddress)
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
