import { IsString } from 'class-validator';

export class SearchLawActInput {
  @IsString()
  name: string;
  @IsString()
  contract: string;
}
