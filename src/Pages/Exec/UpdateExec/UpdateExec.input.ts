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
  @IsOptional()
  @Min(0)
  @Max(100000000)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
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

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  entry_force_dt?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  receipt_recover_dt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fssp_date?: Date | null;

  @IsString()
  @IsOptional()
  r_court_name?: string;

  @IsNumber()
  @IsNotEmpty()
  r_court_id: number;

  @IsNotEmpty()
  @IsNumber()
  template_typ: number;
  /*
   * template variables
   */
  @IsOptional()
  @IsBoolean()
  add_interests?: boolean;
  @IsOptional()
  @IsBoolean()
  rename_notification?: boolean;
  @IsOptional()
  @IsBoolean()
  list_egrul?: boolean;
  @IsOptional()
  @IsNumber()
  custom_requisites_id?: number;
  // end of template variables
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
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  court_sum?: number;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  debt_payments_sum?: number;

  @IsOptional()
  @IsString()
  dsc: string;

  @IsOptional()
  @IsString()
  exec_number: string;
}
