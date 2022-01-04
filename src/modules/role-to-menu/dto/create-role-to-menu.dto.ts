import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";
import { Menu } from "src/modules/menus/entities/menu.entity";
import { Role } from "src/modules/roles/entities/role.entity";
import { PermissionCreate } from "../interfaces/permission";

export class CreateRoleToMenuDto {
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

    @IsString({ message: 'errors.ROLE_STRING' })
    @IsNotEmpty({ message: 'errors.ROLE_NOT_EMPTY' })
    @ApiProperty({
        type: String,
        required: true,
        description: 'Role Id',
        example: '1',
    })
    role: Role;

    @IsString({ message: 'errors.MENU_STRING' })
    @IsNotEmpty({ message: 'errors.MENU_NOT_EMPTY' })
    @ApiProperty({
        type: String,
        required: true,
        description: 'Menu Id',
        example: '1',
    })
    menu: Menu;

    @IsArray({ message: 'errors.PERMISSION_ARRAY' })
    @IsNotEmpty({ message: 'errors.PERMISSION_NOT_EMPTY' })
    @ApiProperty({
        type: [PermissionCreate],
        required: true,
    })
    permissions: PermissionCreate[];
}
