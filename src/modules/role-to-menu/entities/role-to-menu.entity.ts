import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { BaseEntity } from "src/common/entities/base.entity";
import { Menu } from "src/modules/menus/entities/menu.entity";
import { Permission } from "src/modules/permission/entities/permission.entity";
import { Role } from "src/modules/roles/entities/role.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PermissionCreate } from "../interfaces/permission";

@Entity('role-to-menu')
@Unique('qk_role_menu', ['id', 'role', 'menu'])
export class RoleToMenu extends BaseEntity {
    @ApiProperty({
        type: String,
        description: 'Id',
    })
    @PrimaryGeneratedColumn('uuid')
    @Index('pk_role_to_menu_id', ['id'], { unique: true })
    id: string;

    @ApiProperty({
        enum: ['PORTAL', 'PUBLIC'],
        required: true,
        description: 'PORTAL',
        example: 'PORTAL',
    })
    @Column({ type: 'varchar', default: 'PORTAL', enum: ['PORTAL', 'PUBLIC'] })
    type: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Role Id',
        example: '1',
    })
    @ManyToOne(() => Role, role => role.menus, {
        nullable: false
    })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Menu Id',
        example: '1',
    })
    @ManyToOne(() => Menu, menu => menu.roles, {
        nullable: false
    })
    @JoinColumn({ name: "menu_id" })
    menu: Menu;

    @ApiProperty({
        type: [PermissionCreate],
        required: true,
    })
    @ManyToMany(() => Permission)
    @JoinTable({ name: 'menu-to-permission' })
    permissions: PermissionCreate[];
}
