import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DictInput } from './Dict.input';
import { DictService } from './Dict.service';
@Controller('dict')
export class DictController {
  constructor(private dictService: DictService) {}
  @Post()
  @HttpCode(200)
  async dict(@Body() body: DictInput) {
    return await this.dictService.dict(body);
  }
}
