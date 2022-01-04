
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { uid } from 'uid';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new HttpException({ key: 'errors.AVATAR_NOT_VALID' }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mov|avi|wmv|flv|3gp|mp4|mpg|ts)$/)) {
    return callback(new HttpException({ key: 'errors.VIDEO_NOT_VALID' }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const randomName = Date.now() + uid(32);
  return callback(null, `${randomName}${extname(file.originalname)}`);
};
