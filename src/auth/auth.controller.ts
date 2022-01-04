import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { LoginUserDto } from '../modules/users/dto/login-user.dto';
import { LoginRsp } from '../modules/users/interfaces/user';
import { I18nLang } from 'nestjs-i18n';
import { ENUM_MODEL } from 'src/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ValidAddressGuard } from './guards/valid-address-guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  model_name: string = ENUM_MODEL.AUTH;

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(ValidAddressGuard)
  async login(
    @Body() user: LoginUserDto,
    @I18nLang() lang: string,
  ): Promise<LoginRsp> {
    return await this.authService.login(user, lang);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, ValidAddressGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {{token}}',
  })
  async profile(@Request() req) {
    return req.user;
  }
}
