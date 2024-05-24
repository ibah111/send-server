import { IsNotEmpty, IsNumber } from 'class-validator';

export class LawExecInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
