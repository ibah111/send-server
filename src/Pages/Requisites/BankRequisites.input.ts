import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class BankRequisitesClass {
  /**
   * Наименование
   */
  @Length(0, 256)
  @ApiProperty()
  name: string;
  /**
   * Получатель
   */
  @Length(0, 64)
  @ApiProperty()
  recipient: string;
  /**
   * Банк получателя
   */
  @Length(0, 256)
  @ApiProperty()
  br_name: string;
  /**
   * ИНН
   */
  @Length(8, 16)
  @ApiProperty()
  inn: string;
  /**
   * КПП
   */
  @Length(0, 16)
  @ApiPropertyOptional()
  kpp: string;
  /**
   * Рассчётный счёт
   */
  @ApiProperty()
  r_account: string;
  /**
   * БИК
   */
  @ApiProperty()
  @Length(0, 10)
  bik: string;
  /**
   * Корр счёт
   */
  @ApiProperty()
  k_account: string;
  /**
   * Назначение платежа
   */
  @ApiProperty()
  pay_purpose: string;
  /**
   * Юр адресс
   */
  @ApiProperty()
  br_address: string;
  /**
   * Тип реквизита
   */
  @ApiProperty()
  @IsNumber()
  typ: number;
  /**
   * Неизвестно (КБЕ)
   */
  @ApiProperty()
  kbe: string;
  /**
   * Неизвестно (КНП)
   */
  @ApiProperty()
  knp: string;
  /**
   * Неизвестно (КОД)
   */
  @ApiProperty()
  kod: string;
}

export class PaginationValidator implements GridPaginationModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  pageSize: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  page: number;
}
export class SearchPortfolioInput {
  @IsString()
  @ApiProperty({
    default: '',
  })
  name: string;
  @ApiProperty({
    default: {
      page: 0,
      pageSize: 25,
    },
  })
  @Type(() => PaginationValidator)
  paginationModel: PaginationValidator;
}
