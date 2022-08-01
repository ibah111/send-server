import { IsNotEmpty, IsNumber } from 'class-validator';

export class DebtCalcInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
