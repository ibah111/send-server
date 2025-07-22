import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class DictInput {
  @IsNumber()
  @ApiProperty({
    description: 'ID словаря',
    example: 18,
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Название статуса',
    example: 'Отмена приказа',
  })
  name?: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: 'ID словарей, которые не нужно включать в результат',
    example: [],
  })
  not_in_ids?: number[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: 'Названия словарей, которые не нужно включать в результат',
    example: [],
  })
  not_in_names?: string[];
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
