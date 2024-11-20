import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DictInput {
  @IsNumber()
  id: number;
}

export class getRawDictNamesClass {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  code: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: '',
  })
  name: string;
}
