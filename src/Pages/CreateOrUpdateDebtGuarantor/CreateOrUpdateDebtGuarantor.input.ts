import { DebtGuarantor } from '@contact/models';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsInn } from './isInn';
export class CreateOrUpdateDebtGuarantorInput
  implements CreationAttributes<DebtGuarantor>
{
  @Expose()
  @IsNotEmpty()
  fio: string;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  parent_id: number;
  @Expose()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birth_date: Date;
  @Expose()
  @IsString()
  @IsOptional()
  passport: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  sex: string;
  @Expose()
  @IsNumber()
  @IsOptional()
  id?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  sum?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  dsc?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  address?: string | null;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  typ: number;
  @Expose()
  @IsString()
  @IsOptional()
  ext_id?: string | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  family_status?: number | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  education?: number | null;

  @Expose()
  @IsString()
  @IsOptional()
  company_name?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  position?: string | null;
  @Expose()
  @IsInn()
  @IsOptional()
  inn?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  kpp?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  pay_info?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  director_fio?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  contract?: string | null;

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date | null;
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date | null;
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finish_date?: Date | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  currency?: number | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  real_sum?: number | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  fair_sum?: number | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  quality_coeff?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  name?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  birth_place?: string | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  liability?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  id_card?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  social_number?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  tin?: string | null;
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  kind: number;
  @Expose()
  @IsEmail()
  @IsOptional()
  string_value_1?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  string_value_2?: string | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  number_value_1?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  BIK?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  B_NAME?: string | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  DICT_VALUE_1?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  K_ACCOUNT?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  OGRN?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  OKPO?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  OKVED?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  R_ACCOUNT?: string | null;
  @Expose()
  @IsNumber()
  @IsOptional()
  PAS_DOC_TYPE?: number | null;
  @Expose()
  @IsString()
  @IsOptional()
  PAS_NUMBER?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  PAS_PLACE?: string | null;
  @Expose()
  @IsString()
  @IsOptional()
  PAS_SERIES?: string | null;
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PASS_DT?: Date | null;
}
