import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ENUM_STATUS } from './enum';

const jsdom = require("jsdom");

@Injectable()
export class BaseService {
  logger: Logger = new Logger(this.constructor.name);

  @Inject()
  i18n: I18nService;

  comparePassword = (newPassword: string, confirmPassword: string) => {
    if (newPassword === confirmPassword) return;
    throw new HttpException(
      { key: 'errors.COMPARE_PASSWORD_FAIL' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkQuestionExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.QUESTION_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkLinkExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.LINK_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkUrlExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.URL_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkViewExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.VIEW_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkLikeExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.LIKE_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkEpisodesExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.EPISODES_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkCodeExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.CODE_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkHostExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.HOST_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkNameExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.NAME_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkRoleMenuExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.MENU_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkMenuNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.MENU_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkPermissionNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.PERMISSION_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkRoleExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.ROLE_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkCaptchaNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.CAPTCHA_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkRoleNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.ROLE_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkPhoneExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.PHONE_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkMenuExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.MENU_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkEmailExist = (check: boolean): Promise<any> => {
    if (!check) return;
    throw new HttpException(
      { key: 'errors.EMAIL_ALREADY_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkEmailNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.EMAIL_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkMovieNotExist = (check: boolean): Promise<any> => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.MOVIE_NOT_EXISTS' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkStatus = (status): Promise<any> => {
    if (status === ENUM_STATUS.ACTIVE) return;
    throw new HttpException(
      { key: 'errors.STATUS_NOT_ACTIVE' },
      HttpStatus.BAD_REQUEST,
    );
  };

  checkPasswordValid = (check: boolean) => {
    if (check) return;
    throw new HttpException(
      { key: 'errors.PASSWORD_NOT_VALID' },
      HttpStatus.BAD_REQUEST,
    );
  };

  isHTML(str) {
    if (!str) return false;
  
    const dom = new jsdom.JSDOM(str);
    const isHtmlDom = Array.from(dom.window.document.body.childNodes).some((node: any) => node.nodeType === 1);
    const isJavascript = Array.from(dom.window.document.head.childNodes).some((node: any) => node.nodeType === 1);
    const isHtml = (val) =>
      !(val || '')
        // replace html tag with content
        .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
        // remove remaining self closing tags
        .replace(/(<([^>]+)>)/gi, '')
        // remove extra space at start and end
        .trim();
    return isHtmlDom || isHtml(str) || isJavascript;
  }

  throwErrorSystem = (message: any) => {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  };
}
