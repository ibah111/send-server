import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DebtRejectStatusDto {
  @ApiProperty({
    description: 'The ID of the reject status',
    example: 1,
  })
  @IsNumber({}, { message: 'reject_id must be a number' })
  @IsNotEmpty({ message: 'reject_id is required' })
  reject_id: number;
}
