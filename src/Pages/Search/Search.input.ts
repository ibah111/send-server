import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

const description = 'Search variable, it can be empty string';
export class SearchInput {
  @ApiProperty({
    description,
    default: '',
  })
  @IsString()
  name: string;
  @IsString()
  @ApiProperty({
    description,
    default: '',
  })
  contract: string;
}
