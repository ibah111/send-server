import { IsString } from 'class-validator';

export class SearchDebtInput {
  @IsString()
  name: string;
  @IsString()
  contract: string;
}
