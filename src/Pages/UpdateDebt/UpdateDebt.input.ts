import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateDebtInput {
  @IsOptional()
  @IsNumber()
  law_act_id: number;
  @IsOptional()
  @IsNumber()
  law_exec_id: number;
  @IsNotEmpty()
  @IsNumber()
  debt_id: number;
}
