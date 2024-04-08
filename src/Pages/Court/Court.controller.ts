import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { CourtInput } from './Court.input';
import { CourtService } from './Court.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('court')
@UseGuards(AuthGuard)
@ApiBasicAuth()
@ApiTags('Court')
export class CourtController {
  constructor(private courtService: CourtService) {}
  @HttpCode(200)
  @Post()
  async court(@Body() body: CourtInput) {
    return await this.courtService.court(body);
  }
}
