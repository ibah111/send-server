import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDebtGuarantorInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
