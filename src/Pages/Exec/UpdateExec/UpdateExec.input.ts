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
export class SaveOptions {
  @IsOptional()
  @IsBoolean()
  save_file?: boolean;
  @IsBoolean()
  @IsOptional()
  send?: boolean;
}
export class UpdateExecInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10000000)
  total_sum?: number | null;
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
  receipt_recover_dt?: Date;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fssp_date: Date;
  @IsNumber()
  @IsNotEmpty()
  r_court_id: number;
  @IsNotEmpty()
  @IsNumber()
  template_typ: number;
  @IsOptional()
  @IsBoolean()
  add_interests?: boolean;
  @IsNotEmpty()
  @IsNumber()
  debt_guarantor: number;
  @IsOptional()
  @IsNumber()
  person_property?: number;
  @IsOptional()
  @IsNumber()
  appeal_typ?: number;
  @IsOptional()
  @Type(() => SaveOptions)
  options?: SaveOptions;
}
