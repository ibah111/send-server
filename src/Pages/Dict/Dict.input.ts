import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DictInput {
  @IsNumber()
  @ApiProperty({
    description: 'ID словаря',
    example: 1,
  })
  id: number;
}

export class GetRawDictNamesClass {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'ID словаря',
    example: 1,
  })
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Код словаря',
    example: 1,
  })
  code: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Название словаря',
    example: 'Название словаря',
  })
  name: string;
}
