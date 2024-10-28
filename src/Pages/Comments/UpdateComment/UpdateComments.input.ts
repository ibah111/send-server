import { IsNumber, IsString } from 'class-validator';

export default class UpdateCommentsInput {
  @IsNumber()
  law_exec_id: number;
  @IsString()
  law_exec_comment: string;
  @IsString()
  law_act_comment: string;
}
