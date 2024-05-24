import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CourtInput } from './Court.input';
import { CourtService } from './Court.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('court')
@ApiTags('Court')
export class CourtController {
  constructor(private courtService: CourtService) {}
  @HttpCode(200)
  @Post()
  async court(@Body() body: CourtInput) {
    return await this.courtService.court(body);
  }
}
