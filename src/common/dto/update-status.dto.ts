import {
    IsIn,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class UpdateStatusDTO {
    @IsString({ message: 'errors.STATUS_STRING' })
    @IsNotEmpty({ message: 'errors.STATUS_NOT_EMPTY' })
    @IsIn(['ACTIVE', 'INACTIVE'], { message: 'errors.STATUS_NOT_VALID' })
    status: string;
}
  