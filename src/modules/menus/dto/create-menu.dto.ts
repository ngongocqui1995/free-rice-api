import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateMenuDto {
    @IsString({ message: 'errors.URL_STRING' })
    @IsNotEmpty({ message: 'errors.URL_NOT_EMPTY' })
    @Length(0, 100, { message: 'errors.URL_LENGTH_0_100' })
    @ApiProperty({
        type: String,
        description: 'Admin/User',
        example: 'Admin/User',
        required: true,
    })
    url: string;

    @IsString({ message: 'errors.TYPE_MENU_STRING' })
    @IsNotEmpty({ message: 'errors.TYPE_MENU_NOT_EMPTY' })
    @IsIn(['PORTAL', 'PUBLIC'], { message: 'errors.TYPE_MENU_NOT_VALID' })
    @ApiProperty({
        type: String,
        description: 'PORTAL, PUBLIC',
        example: 'PORTAL',
        required: true,
    })
    type: string;

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
