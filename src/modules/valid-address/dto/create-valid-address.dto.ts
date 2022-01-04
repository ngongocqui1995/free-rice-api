import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateValidAddressDto {
  @IsString({ message: 'errors.HOST_STRING' })
  @IsNotEmpty({ message: 'errors.HOST_NOT_EMPTY' })
  @Transform((params) => String(params.value).trim())
  @ApiProperty({
    type: String,
    required: true,
    description: '127.0.0.1',
    example: '127.0.0.1',
  })
  host: string;

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
