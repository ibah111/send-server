import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCommentInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsBoolean()
  law_exec: boolean;
  @IsBoolean()
  law_act: boolean;
  @IsNotEmpty()
  @IsString()
  value: string;
}
