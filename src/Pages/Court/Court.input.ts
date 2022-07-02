import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CourtInput {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsString()
  name?: string;
}
