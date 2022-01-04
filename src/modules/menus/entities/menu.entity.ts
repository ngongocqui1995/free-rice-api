import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { BaseEntity } from "src/common/entities/base.entity";
import { RoleToMenu } from "src/modules/role-to-menu/entities/role-to-menu.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('menus')
@Unique("uq_url_type", ["url", "type"])
export class Menu extends BaseEntity {
    @ApiProperty({
        type: String,
        description: 'Id',
    })
    @PrimaryGeneratedColumn('uuid')
    @Index('pk_menu_id', ['id'], { unique: true })
    id: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Admin/User',
        example: 'Admin/User',
    })
    @Column({ type: 'varchar', length: 100 })
    url: string;

    @ApiProperty({
        enum: ['PORTAL', 'PUBLIC'],
        required: true,
        description: 'PORTAL',
        example: 'PORTAL',
    })
    @Column({ type: 'varchar', default: 'PORTAL', enum: ['PORTAL', 'PUBLIC'] })
    type: string;

    @OneToMany(() => RoleToMenu, roleToMenu => roleToMenu.menu)
    roles: RoleToMenu[];

    @ApiProperty({
        enum: ['ACTIVE', 'INACTIVE'],
        description: 'ACTIVE',
        example: 'ACTIVE',
    })
    @Column({ type: 'varchar', nullable: false, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
    status: string;
}
