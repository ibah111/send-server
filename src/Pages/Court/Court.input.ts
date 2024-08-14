import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class LawCourtInput {
  @IsString()
  @ApiProperty()
  index_code: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiPropertyOptional()
  phone: string;
  @ApiProperty()
  discrict: string;
  @ApiPropertyOptional()
  court_typ: number;
  @ApiProperty({
    //FSSP, OSP, ROSP types
    default: 2,
  })
  typ: number;
  @ApiPropertyOptional()
  EMAIL: string;
  @ApiPropertyOptional()
  EXT_ID$: string;
  @ApiPropertyOptional()
  EXT_ID_NUM: string;
}
