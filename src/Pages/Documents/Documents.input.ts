import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class LawExecDocumentsInput {
  @ApiProperty({
    description: 'id для поиска вложений по исполнительному производству',
  })
  @ValidateIf((o) => o.id === undefined)
  @IsNotEmpty()
  @IsNumber()
  law_exec_id: number;

  @ApiProperty({
    description: 'Я пока не знаю для чего это существует',
  })
  @ValidateIf((o) => o.law_exec_id === undefined)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class LawActDocumentsInput {
  @ApiProperty({
    description: 'id для поиска вложений по исполнительному производству',
  })
  @IsNumber()
  law_act_id: number;
}
export class DocumentsRemoveInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
