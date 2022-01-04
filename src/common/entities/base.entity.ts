import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({
    type: String,
    description: 'createdAt',
  })
  @CreateDateColumn({ nullable: true })
  readonly createdAt: Date;

  @ApiProperty({
    type: String,
    description: 'updatedAt',
  })
  @UpdateDateColumn({ nullable: true })
  readonly updatedAt: Date;
}
