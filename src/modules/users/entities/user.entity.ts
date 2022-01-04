import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    type: String,
    description: 'Id',
  })
  @PrimaryGeneratedColumn('uuid')
  @Index('pk_user_id', ['id'], { unique: true })
  id: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    maxLength: 100,
    required: true,
    description: 'Email',
    example: 'abc@gmail.com',
  })
  @Column({ type: 'varchar', unique: true, nullable: false, length: 100 })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'Mật khẩu phải 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 kí tự đặc biệt!',
    example: '123456',
  })
  @Column({ type: 'varchar', nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Role Id',
    example: '1',
  })
  @ManyToOne(() => Role, role => role.users, {
    nullable: false
  })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
    description: 'Name',
    example: 'abc',
  })
  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Avatar',
    example: 'avatar',
  })
  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @ApiProperty({
    enum: ['MALE', 'FEMALE', 'OTHER'],
    description: 'Gender',
    example: 'MALE',
  })
  @Column({ type: 'varchar', nullable: false, default: 'OTHER', enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @ApiProperty({
    type: String,
    description: 'Phone',
    example: '0858585858',
  })
  @Column({ type: 'varchar', unique: true, nullable: false, length: 20 })
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Code',
    example: '1',
  })
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @Exclude({ toPlainOnly: true })
  code: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Price',
    example: 0,
  })
  @Column({ type: 'float', nullable: false, default: 0 })
  @Exclude({ toPlainOnly: true })
  price: number;

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE'],
    description: 'ACTIVE',
    example: 'ACTIVE',
  })
  @Column({ type: 'varchar', nullable: false, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;
}
