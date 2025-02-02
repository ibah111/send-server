import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import ExecService from './Exec.service';

@Controller('Exec')
@ApiTags('LawExec')
@UseGuards(AuthGuard)
export class ExecController {
  constructor(private readonly service: ExecService) {}

  @Post('saveId')
  async saveId(@Body() body: any) {
    return await this.service.saveId(body);
  }

  @Post('createIp')
  async createIp(@Body() body: any) {
    return await this.service.createIp(body);
  }
}
