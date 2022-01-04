import {
  IsEmail,
  IsNotEmpty, IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString({ message: 'errors.EMAIL_STRING' })
  @IsNotEmpty({ message: 'errors.EMAIL_NOT_EMPTY' })
  @IsEmail({}, { message: 'errors.EMAIL_NOT_VALID' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'abc@gmail.com',
  })
  email: string;

  @IsString({ message: 'errors.PASSWORD_STRING' })
  @IsNotEmpty({ message: 'errors.PASSWORD_NOT_EMPTY' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'Duc1@',
  })
  password: string;
}
