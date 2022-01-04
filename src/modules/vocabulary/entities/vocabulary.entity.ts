import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('vocabulary')
@Unique('qk_question_answer', ['question', 'answer'])
export class Vocabulary extends BaseEntity {
  @ApiProperty({
    type: String,
    description: 'Id',
  })
  @PrimaryGeneratedColumn('uuid')
  @Index('pk_vocabulary_id', ['id'], { unique: true })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'question',
    example: 'question',
  })
  @Column({ type: 'varchar', nullable: false })
  question: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'answer',
    example: 'answer',
  })
  @Column({ type: 'varchar', nullable: false })
  answer: string;
}
