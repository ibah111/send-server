import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { DictService } from './Dict.service';
@Controller('dict')
@UseGuards(AuthGuard)
export class DictController {
  constructor(private dictService: DictService) {}
  @Post()
  @HttpCode(200)
  async dict(@Body() body: any) {
    return await this.dictService.dict(body);
  }
}
