import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class DocumentsInput {
  @ValidateIf((o) => o.id === undefined)
  @IsNotEmpty()
  @IsNumber()
  law_exec_id: number;
  @ValidateIf((o) => o.law_exec_id === undefined)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
export class DocumentsRemoveInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
