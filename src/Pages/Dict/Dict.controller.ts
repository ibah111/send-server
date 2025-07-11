import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DictInput, GetRawDictNamesClass } from './Dict.input';
import { DictService } from './Dict.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('dict')
@ApiTags('Dict')
export class DictController {
  constructor(private dictService: DictService) {}
  @Post()
  @HttpCode(200)
  async dict(@Body() body: DictInput) {
    return await this.dictService.dict(body);
  }

  @Post('getDictName')
  async raw(@Body() body: GetRawDictNamesClass) {
    return this.dictService.getRawDictNames(body);
  }
}
