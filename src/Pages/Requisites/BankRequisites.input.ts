import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length } from 'class-validator';

export class BankRequisitesClass {
  @Length(0, 256)
  @ApiProperty()
  name: string;
  @Length(0, 64)
  @ApiProperty()
  recipient: string;
  @Length(0, 256)
  @ApiProperty()
  br_name: string;
  @Length(16, 16)
  @ApiProperty()
  inn: string;
  @Length(16, 16)
  @ApiProperty()
  kpp: string;
  @ApiProperty()
  r_account: string;
  @ApiProperty()
  @Length(10, 10)
  bik: string;
  @ApiProperty()
  k_account: string;
  @ApiProperty()
  pay_purpose: string;
  @ApiProperty()
  br_address: string;
  @ApiProperty()
  @IsNumber()
  typ: number;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  kbe: string;
  @ApiProperty()
  knp: string;
  @ApiProperty()
  kod: string;
}
