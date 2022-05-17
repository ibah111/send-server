import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { LawExecService } from './LawExec.service';

@Controller('law_exec')
@UseGuards(AuthGuard)
export class LawExecController {
  constructor(private readonly lawExecService: LawExecService) {}
  @Post()
  @HttpCode(200)
  async law_exec(@Body() body: any) {
    return await this.lawExecService.law_exec(body);
  }
}
