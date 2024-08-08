import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CourtInput {
  @ApiProperty({
    description: 'Optional API variable, works like search',
  })
  @IsOptional()
  @IsNumber()
  id?: number;
  @ApiProperty({
    description: 'Optional API variable, works like search',
  })
  @IsOptional()
  @IsString()
  name?: string;

  data?: {
    id?: number;
    name?: string;
  };
}
