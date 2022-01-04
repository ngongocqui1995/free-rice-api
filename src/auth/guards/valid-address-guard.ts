import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { ENUM_STATUS } from 'src/common';
import { ValidAddressService } from 'src/modules/valid-address/valid-address.service';
import { In } from 'typeorm';

@Injectable()
export class ValidAddressGuard implements CanActivate {
  logger: Logger = new Logger('valid_address');

  constructor(
    private validAddressService: ValidAddressService,
  ) {}

  /**
   * Check can activate.
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // if image is nextjs
    const userAgent: string = request.get('user-agent');
    if (userAgent.indexOf('node-fetch') !== -1) return true;

    const urlReferer = request.get('referer') && new URL(request.get('referer'));
    this.logger.debug(`${request?.clientIp}, ${urlReferer?.hostname}`);
    const validAddress = await this.validAddressService.findOne({ 
      where: { 
        host: In([request?.clientIp, urlReferer?.hostname]),
        status: ENUM_STATUS.ACTIVE
      }
    });
    if (!validAddress) return false;

    return true;
  }
}
