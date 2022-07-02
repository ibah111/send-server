import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
export enum GetCommentType {
  LAW_ACT = 'law_act',
  LAW_EXEC = 'law_exec',
}
export class GetCommentInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsEnum(GetCommentType)
  @IsNotEmpty()
  type: GetCommentType;
}
