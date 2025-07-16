import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class KeyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
      required: true,
      description: 'Ключ для доступа к кэшу',
      example: 'reject_statuses',
  })
  key: string;
}
