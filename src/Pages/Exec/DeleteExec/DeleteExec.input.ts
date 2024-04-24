import { IsNumber } from 'class-validator';

export class DeleteExecInput {
  @IsNumber()
  id: number;
}
