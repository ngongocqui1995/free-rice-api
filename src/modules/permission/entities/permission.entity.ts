import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { RoleToMenu } from "src/modules/role-to-menu/entities/role-to-menu.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class Permission extends BaseEntity {
    @ApiProperty({
        type: String,
        description: 'Id',
    })
    @PrimaryGeneratedColumn('uuid')
    @Index('pk_permission_id', ['id'], { unique: true })
    id: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Create',
        example: 'Create',
    })
    @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
    code: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Create',
        example: 'Create',
    })
    @Column({ type: 'varchar', nullable: false, length: 50 })
    name: string;

    @ApiProperty({
        type: String,
        description: 'red',
        example: 'red',
    })
    @Column({ type: 'varchar', nullable: true, length: 50 })
    color: string;

    @ApiProperty({
        enum: ['ACTIVE', 'INACTIVE'],
        description: 'ACTIVE',
        example: 'ACTIVE',
    })
    @Column({ type: 'varchar', nullable: false, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
    status: string;
}
