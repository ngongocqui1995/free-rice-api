import {
    IsIn,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateStatusDTO {
    @IsString({ message: 'errors.STATUS_STRING' })
    @IsNotEmpty({ message: 'errors.STATUS_NOT_EMPTY' })
    @IsIn(['ACTIVE', 'INACTIVE'], { message: 'errors.STATUS_NOT_VALID' })
    @ApiProperty({
      type: String,
      required: true,
      description: 'ACTIVE, INACTIVE',
      example: 'ACTIVE',
    })
    status: string;
}
  