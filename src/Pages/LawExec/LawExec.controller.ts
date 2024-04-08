import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { LawExecInput } from './LawExec.input';
import { LawExecService } from './LawExec.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exec')
@Controller('law_exec')
@UseGuards(AuthGuard)
export class LawExecController {
  constructor(private readonly lawExecService: LawExecService) {}
  @Post()
  @HttpCode(200)
  async law_exec(@Body() body: LawExecInput) {
    return await this.lawExecService.law_exec(body);
  }
}
