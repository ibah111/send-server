import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthGuard } from 'src/Modules/Guards/auth.guard';
import ExecService from './Exec.service';

@Controller('Exec')
@ApiTags('LawExec')
@UseGuards(AuthGuard)
export class ExecController {
  constructor(private readonly service: ExecService) {}

  @Post('saveId')
  async saveId(@Body() body: any) {
    console.log(body);
    return;
    return await this.service.saveId();
  }

  @Post('createIp')
  async createIp(@Body() body: any, @Auth() auth: any) {
    console.log(body);
    return;
    return await this.service.createIp();
  }
}
