import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExecInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  total_sum: number;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  load_dt: Date;
  @IsString()
  @IsNotEmpty()
  court_doc_num: string;
  @IsNumber()
  @IsNotEmpty()
  executive_typ: number;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  court_date: Date;
  @IsNumber()
  @IsNotEmpty()
  DELIVERY_TYP: number;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  entry_force_dt: Date;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  receipt_recover_dt: Date;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fssp_date: Date;
  @IsNumber()
  @IsNotEmpty()
  r_court_id: number;
  @IsNumber()
  template_typ: number;
}
