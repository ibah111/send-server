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
  @IsNotEmpty()
  @IsString()
  court_doc_num: string;
  @IsNotEmpty()
  @IsNumber()
  executive_typ: number;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  court_date: Date;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  entry_force_dt: Date;
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
