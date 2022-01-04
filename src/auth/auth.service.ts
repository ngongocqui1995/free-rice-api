import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../modules/users/dto/login-user.dto';
import { LoginRsp } from '../modules/users/interfaces/user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { BaseService } from '../common/base.service';
import { PasswordHasherService } from './password-hasher/password-hasher.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { I18nLang } from 'nestjs-i18n';

@Injectable()
export class AuthService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repo,
    private checkService: BaseService,
    private hasherService: PasswordHasherService,
    private jwtService: JwtService,
  ) {
    super(repo);
  }

  async login(dto: LoginUserDto, @I18nLang() lang: string): Promise<LoginRsp> {
    // verfiy user email
    const user = await this.findOne({
      where: { email: dto.email },
    });
    this.checkService.checkEmailNotExist(!!user);

    // check status
    this.checkService.checkStatus(user.status);

    // verify user password
    const matchedPassword = await this.hasherService.comparePassword(
      dto.password,
      user.password,
    );
    this.checkService.checkPasswordValid(matchedPassword);

    // generate JSON web token
    const token = await this.jwtService.signAsync(
      { email: user.email, id: user.id, name: user.name, avatar: user.avatar },
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return {
      token,
      message: await this.checkService.i18n.translate('messages.AUTH.GET', {
        lang,
      }),
    };
  }
}
