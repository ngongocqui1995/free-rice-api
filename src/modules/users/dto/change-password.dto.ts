import {
    IsIn,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class ChangePasswordDTO {
    @IsString({ message: 'errors.CURRENT_PASSWORD_STRING' })
    @IsNotEmpty({ message: 'errors.CURRENT_PASSWOR_NOT_EMPTY' })
    @ApiProperty({
      type: String,
      required: true,
    })
    current_password: string;

    @IsString({ message: 'errors.NEW_PASSWORD_STRING' })
    @IsNotEmpty({ message: 'errors.NEW_PASSWOR_NOT_EMPTY' })
    @ApiProperty({
      type: String,
      required: true,
    })
    new_password: string;

    @IsString({ message: 'errors.CONFIRM_PASSWORD_STRING' })
    @IsNotEmpty({ message: 'errors.CONFIRM_PASSWOR_NOT_EMPTY' })
    @ApiProperty({
      type: String,
      required: true,
    })
    confirm_password: string;
}
  