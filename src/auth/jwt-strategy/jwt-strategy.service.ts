import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ENUM_STATUS } from 'src/common';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // find the user based on id from the payload.id
    const user = await this.userService.findOne({
      where: { id: payload.id },
      relations: ["role", "role.menus", "role.menus.menu", "role.menus.permissions"]
    });
    if (!user) throw new UnauthorizedException('UnAuthorized');

    if (user.status != ENUM_STATUS.ACTIVE) throw new UnauthorizedException('Tài khoản chưa kích hoạt!');

    delete user.password;
    return user;
  }
}