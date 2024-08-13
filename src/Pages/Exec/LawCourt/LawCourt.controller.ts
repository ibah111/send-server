import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LawCourtService } from './LawCourt.service';
import { LawCourtInput } from './LawCourt.input';

@ApiTags('LawCourt')
@Controller('LawCourt')
export class LawCourtController {
  private readonly LawCourtService: LawCourtService;

  @Post('addLawCourt')
  async addLawCourt(@Body() body: LawCourtInput) {
    return await this.LawCourtService.AddLawCourt(body);
  }
}
