import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDebtInput {
  @IsNotEmpty()
  @IsNumber()
  law_exec_id: number;
  @IsNotEmpty()
  @IsNumber()
  debt_id: number;
}
