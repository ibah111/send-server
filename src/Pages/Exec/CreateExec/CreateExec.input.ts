import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateExecOld {
  @IsOptional()
  @IsString()
  court_doc_num?: string;
  @IsOptional()
  @IsNumber()
  executive_typ?: number;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  court_date?: Date;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  entry_force_dt?: Date;
}
export class CreateExecInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsOptional()
  @Type(() => CreateExecOld)
  @ValidateNested()
  old: CreateExecOld;
}
