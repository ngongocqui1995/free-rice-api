import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreatePermissionDto {
    @IsString({ message: 'errors.CODE_STRING' })
    @IsNotEmpty({ message: 'errors.CODE_NOT_EMPTY' })
    @Length(3, 50, { message: 'errors.CODE_LENGTH_3_50' })
    @Transform((params) => String(params.value).trim())
    @ApiProperty({
        type: String,
        required: true,
        description: 'create',
        example: 'create',
    })
    code: string;

    @IsString({ message: 'errors.NAME_STRING' })
    @IsNotEmpty({ message: 'errors.NAME_NOT_EMPTY' })
    @Length(3, 50, { message: 'errors.NAME_LENGTH_3_50' })
    @ApiProperty({
        type: String,
        required: true,
        description: 'create',
        example: 'create',
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
