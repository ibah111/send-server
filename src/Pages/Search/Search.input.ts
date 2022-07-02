import { IsString } from 'class-validator';

export class SearchInput {
  @IsString()
  name: string;
  @IsString()
  contract: string;
}
