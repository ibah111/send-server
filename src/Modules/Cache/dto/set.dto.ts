import { ApiProperty } from '@nestjs/swagger';
import { KeyDto } from './key.dto';

export class SetDto extends KeyDto {
  @ApiProperty({
    description: 'Значение для кэша',
    example: {
      test: 'test',
    },
  })
  value: any;

  @ApiProperty({
    description: 'Время жизни кэша',
    example: 60000,
  })
  ttl: number;
}
