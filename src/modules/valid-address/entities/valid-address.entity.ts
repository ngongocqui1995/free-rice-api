import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('valid-address')
export class ValidAddress extends BaseEntity {
  @ApiProperty({
    type: String,
    description: 'Id',
  })
  @PrimaryGeneratedColumn('uuid')
  @Index('pk_valid_address_id', ['id'], { unique: true })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '127.0.0.1',
    example: '127.0.0.1',
  })
  @Column({ type: 'varchar', nullable: false, unique: true })
  host: string;

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE'],
    description: 'ACTIVE',
    example: 'ACTIVE',
  })
  @Column({ type: 'varchar', nullable: false, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;
}
