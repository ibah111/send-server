import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateExecInput {
  [key: string]: number | string | Date | boolean | null;
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10000000)
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
  @IsOptional()
  @IsNumber()
  template_typ: number;
  @IsOptional()
  @IsBoolean()
  add_interests: boolean;
}
