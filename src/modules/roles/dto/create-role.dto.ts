import { IsNotEmpty, IsString, Length, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString({ message: 'errors.CODE_STRING' })
  @IsNotEmpty({ message: 'errors.CODE_NOT_EMPTY' })
  @Length(3, 50, { message: 'errors.CODE_LENGTH_3_50' })
  @Transform((params) => String(params.value).trim())
  @ApiProperty({
    type: String,
    required: true,
    description: 'admin',
    example: 'admin',
  })
  code: string;

  @IsOptional()
  @IsString({ message: 'errors.AVATAR_STRING' })
  @IsNotEmpty({ message: 'errors.AVATAR_NOT_EMPTY' })
  @ApiProperty({
    type: String,
    description: 'Avatar',
    example: 'avatar',
    required: false,
  })
  avatar: string;

  @IsString({ message: 'errors.NAME_STRING' })
  @IsNotEmpty({ message: 'errors.NAME_NOT_EMPTY' })
  @Length(3, 50, { message: 'errors.NAME_LENGTH_3_50' })
  @ApiProperty({
    type: String,
    required: true,
    description: 'Admin',
    example: 'Admin',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'errors.COLOR_STRING' })
  @IsNotEmpty({ message: 'errors.COLOR_NOT_EMPTY' })
  @Length(0, 50, { message: 'errors.COLOR_LENGTH_0_50' })
  @ApiProperty({
    type: String,
    description: 'red',
    example: 'red',
  })
  color: string;

  @IsOptional()
  @IsString({ message: 'errors.STATUS_STRING' })
  @IsNotEmpty({ message: 'errors.STATUS_NOT_EMPTY' })
  @IsIn(['ACTIVE', 'INACTIVE'], { message: 'errors.STATUS_NOT_VALID' })
  @ApiProperty({
    type: String,
    description: 'ACTIVE, INACTIVE',
    example: 'ACTIVE',
  })
  status: string;
}
