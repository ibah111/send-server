import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import ExecService from './Exec.service';

@Controller('Exec')
@ApiTags('LawExec')
@UseGuards(AuthGuard)
export class ExecController {
  constructor(private readonly service: ExecService) {}

  @Post('saveId')
  async saveId(@Body() body: any, @Auth() auth: AuthResult) {
    return await this.service.save(body, auth);
  }

  @Post('createIp')
  async createIp(@Body() body: any, @Auth() auth: AuthResult) {
    return await this.service.create(body, auth);
  }
}
