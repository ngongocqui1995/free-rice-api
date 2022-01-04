import { HttpStatus, Injectable, Param, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, CrudService, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import to from 'await-to-js';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { BaseService } from 'src/common/base.service';
import { Connection, Not } from 'typeorm';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary } from './entities/vocabulary.entity';

@Injectable()
export class VocabularyService extends TypeOrmCrudService<Vocabulary> {
  model_name: string = ENUM_MODEL.COMMENT;

  constructor(
    @InjectRepository(Vocabulary) repo, 
    private checkService: BaseService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<Vocabulary> {
    return this;
  }

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateVocabularyDto,
    @I18nLang() lang: string
  ) {
    const questionExist = await this.findOne({
      where: { question: dto.question, id: Not(id) },
    });
    this.checkService.checkQuestionExist(!!questionExist);

    const [err, res] = await to(
      this.updateOne(req, <Vocabulary>dto),
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
    @ParsedBody() dto: CreateVocabularyDto,
    @I18nLang() lang: string
  ) {
    const questionExist = await this.findOne({
      where: { question: dto.question, id: Not(id) },
    });
    this.checkService.checkQuestionExist(!!questionExist);

    const [err] = await to(
      this.replaceOne(req, <Vocabulary>dto),
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
    @ParsedBody() dto: CreateVocabularyDto,
    @I18nLang() lang: string
  ) {
    const questionExist = await this.findOne({
      where: { question: dto.question },
    });
    this.checkService.checkQuestionExist(!!questionExist);

    const [err] = await to(this.createOne(req, <Vocabulary>dto));
    if (err) this.checkService.throwErrorSystem(err.message);

    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.CREATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async createBase(dto: Vocabulary) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(Vocabulary)
      .values([dto])
      .onConflict(`("question", "answer") DO NOTHING`)
      .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.checkService.throwErrorSystem(err.message);
    } finally {
      await queryRunner.release();
    }

    return {status: HttpStatus.OK}
  }

  async createManyBase(dto: Vocabulary[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(Vocabulary)
      .values(dto)
      .onConflict(`("question", "answer") DO NOTHING`)
      .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.checkService.throwErrorSystem(err.message);
    } finally {
      await queryRunner.release();
    }

    return {status: HttpStatus.OK}
  }

  async updateBase(id: string, dto: Vocabulary) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .update(Vocabulary)
      .set(dto)
      .where("id = :id", { id })
      .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.checkService.throwErrorSystem(err.message);
    } finally {
      await queryRunner.release();
    }

    return {status: HttpStatus.OK}
  }
}
