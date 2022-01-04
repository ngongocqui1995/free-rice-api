import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ENUM_STATUS } from 'src/common';
import { ROLES } from 'src/modules/roles/contants/contants';
import { User } from 'src/modules/users/entities/user.entity';
import { ValidAddressService } from 'src/modules/valid-address/valid-address.service';
import { In } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  logger: Logger = new Logger('role_guard');

  constructor(
    private reflector: Reflector,
    private validAddressService: ValidAddressService,
  ) {}

  /**
   * Check can activate.
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user || user.status !== ENUM_STATUS.ACTIVE) return false;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const urlReferer = request.get('referer') && new URL(request.get('referer'));
    this.logger.debug(`${request?.clientIp}, ${urlReferer?.hostname}`);
    const validAddress = await this.validAddressService.findOne({ 
      where: { 
        host: In([request?.clientIp, urlReferer?.hostname]),
        status: ENUM_STATUS.ACTIVE
      }
    })
    if (!validAddress) return false;

    // match require roles
    return await this.isMatchRoles(roles, user);
  }

  async isMatchRoles(roles: string[], user: User) {    
    if (user.role.code === ROLES.ROLE_ADMIN) return true;
    if (roles.includes(user.role.code)) return true;

    return false;
  }
}
