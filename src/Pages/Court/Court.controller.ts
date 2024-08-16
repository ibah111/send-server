import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CourtInput, LawCourtInput } from './Court.input';
import { CourtService } from './Court.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('court')
@ApiTags('Court')
export class CourtController {
  constructor(private courtService: CourtService) {}
  @HttpCode(200)
  @Post()
  async court(@Body() body: CourtInput) {
    return await this.courtService.court(body);
  }

  @ApiOperation({
    description:
      'typ = 2 в i_collect = ОСП, РОСП. Поиск по ФССП из подачи по typ = 2',
    summary: 'Добавить ОСП, РОСП, ФССП',
  })
  @Post('addLawCourt')
  async addLawCourt(@Body() body: LawCourtInput) {
    return await this.courtService.AddLawCourt(body);
  }
}
