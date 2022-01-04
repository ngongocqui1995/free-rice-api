import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ENUM_STATUS } from './enum';

@Injectable()
export class BaseController {
  logger: Logger = new Logger(this.constructor.name);

  @Inject()
  i18n: I18nService;

  checkStatusUser = (id: string, userId: string): Promise<any> => {
    if (id != userId) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_USER_CURRENT' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkFileExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.FILE_NOT_EXIST' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusMovie = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_MOVIE_USING' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusPartMovie = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_PART_MOVIE_HAVE_MOVIE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusFansub = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_FANSUB_HAVE_MOVIE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusMovieGroup = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_MOVIE_GROUP_HAVE_MOVIE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusCategories = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_CATEGORIES_HAVE_MOVIE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusRole = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_ROLE_HAVE_USER' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusPermission = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_PERMISSION_HAVE_ROLE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatusMenu = (check: boolean, status: string): Promise<any> => {
    if (!check || status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.CHANGE_STATUS_MENU_HAVE_ROLE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  throwErrorSystem = (message: any) => {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  };
}
