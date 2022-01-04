import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateVocabularyDto {
  @IsString({ message: 'errors.QUESTION_STRING' })
  @IsNotEmpty({ message: 'errors.QUESTION_NOT_EMPTY' })
  @ApiProperty({
      type: String,
      required: true,
      description: 'Question',
      example: 'Answer',
  })
  question: string;

  @IsString({ message: 'errors.ANSWER_STRING' })
  @IsNotEmpty({ message: 'errors.ANSWER_NOT_EMPTY' })
  @ApiProperty({
    type: String,
    required: true,
    description: 'Answer',
    example: 'Answer',
  })
  answer: string;
}
