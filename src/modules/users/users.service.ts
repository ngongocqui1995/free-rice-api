import { Body, HttpStatus, Injectable, Param, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { User } from './entities/user.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  CrudRequest,
  CrudService,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { BaseService } from '../../common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordHasherService } from '../../auth/password-hasher/password-hasher.service';
import { Connection, Not } from 'typeorm';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { CreateCustomerDto } from './dto/create-cutomer.dto';
import { UpdateStatusDTO } from 'src/common/dto/update-status.dto';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  model_name: string = ENUM_MODEL.USER;
  status_name: string = ENUM_MODEL.STATUS;

  constructor(
    @InjectRepository(User) repo,
    private checkService: BaseService,
    private rolesService: RolesService,
    private hashService: PasswordHasherService,
    private connection: Connection,
  ) {
    super(repo);
  }

  get base(): CrudService<User> {
    return this;
  }

  async replaceOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUserDto,
    @I18nLang() lang: string,
  ) {
    const emailExist = await this.findOne({
      where: { email: dto.email, id: Not(id) },
    });
    this.checkService.checkEmailExist(!!emailExist);

    const phoneExist = await this.findOne({
      where: { phone: dto.phone, id: Not(id) },
    });
    this.checkService.checkPhoneExist(!!phoneExist);

    const roleExist = await this.rolesService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);

    delete dto.password;
    const [err] = await to(
      this.replaceOne(req, <User>dto),
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

  async updateOneBase(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
    @I18nLang() lang: string,
  ) {
    const emailExist = await this.findOne({
      where: { email: dto.email, id: Not(id) },
    });
    this.checkService.checkEmailExist(!!emailExist);

    const phoneExist = await this.findOne({
      where: { phone: dto.phone, id: Not(id) },
    });
    this.checkService.checkPhoneExist(!!phoneExist);

    const roleExist = await this.rolesService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);

    delete dto.password;
    const [err] = await to(
      this.updateOne(req, <User>dto),
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
    @ParsedBody() dto: CreateUserDto,
    @I18nLang() lang: string,
  ) {
    const emailExist = await this.findOne({
      where: { email: dto.email },
    });
    this.checkService.checkEmailExist(!!emailExist);

    const phoneExist = await this.findOne({
      where: { phone: dto.phone },
    });
    this.checkService.checkPhoneExist(!!phoneExist);

    const roleExist = await this.rolesService.findOne({
      where: { id: dto.role },
    });
    this.checkService.checkRoleNotExist(!!roleExist);
    
    const encryptedPassword = this.hashService.hashPassword(dto.password);
    const [err] = await to(
      this.createOne(req, <User>{
        ...dto,
        password: encryptedPassword,
        price: 0,
      }),
    );
    if (err) this.checkService.throwErrorSystem(err.message);

    return {
      status: HttpStatus.OK,
      message: await this.checkService.i18n.translate('messages.ACTION.CREATE', {
        lang,
        args: [{ name: await this.checkService.i18n.translate('models.'+this.model_name) }]
      }),
    };
  }

  async createCustomerTransaction(dto: User) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(User)
      .values(dto)
      .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.checkService.throwErrorSystem(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(id: string, updateStatusDTO: UpdateStatusDTO, @I18nLang() lang: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.createQueryBuilder()
      .update(User)
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

  async changePassword(@Request() req, changePasswordDTO: ChangePasswordDTO, @I18nLang() lang: string) {
    // verify user password
    const user = await this.findOne({where: { id: req.user.id }});
    const matchedPassword = await this.hashService.comparePassword(
      changePasswordDTO.current_password,
      user.password,
    );
    this.checkService.checkPasswordValid(matchedPassword);
    this.checkService.comparePassword(changePasswordDTO.new_password, changePasswordDTO.confirm_password);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const encryptedPassword = this.hashService.hashPassword(changePasswordDTO.current_password);

      await queryRunner.manager.createQueryBuilder()
      .update(User)
      .set({ password: encryptedPassword })
      .where("id = :id", { id: req.user.id })
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
      message: await this.checkService.i18n.translate('messages.RESET_PASSWORD.PASSWORD_CHANGED'),
    }
  }
}
