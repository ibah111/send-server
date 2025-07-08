import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddLawActRejectStatusDto {
  @ApiProperty({
    description: 'The name of the reject status',
    example: 'Отмена приказа',
  })
  @IsString({
    message: 'reject_name must be a string',
  })
  @IsNotEmpty({
    message: 'reject_name is required',
  })
  reject_name: string;
}
