import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { RoleToMenu } from 'src/modules/role-to-menu/entities/role-to-menu.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @ApiProperty({
    type: String,
    description: 'Id',
  })
  @PrimaryGeneratedColumn('uuid')
  @Index('pk_role_id', ['id'], { unique: true })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'admin',
    example: 'admin',
  })
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  code: string;

  @ApiProperty({
    type: String,
    description: 'Avatar',
    example: 'avatar',
  })
  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Admin',
    example: 'Admin',
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

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => RoleToMenu, roleToMenu => roleToMenu.role)
  menus: RoleToMenu[];

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE'],
    description: 'ACTIVE',
    example: 'ACTIVE',
  })
  @Column({ type: 'varchar', nullable: false, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;
}
