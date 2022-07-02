import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  Auth,
  AuthGuard,
  AuthUserSuccess,
} from 'src/Modules/Guards/auth.guard';
import { CreateExecService } from './CreateExec.service';
@Controller('create_exec')
@UseGuards(AuthGuard)
export class CreateExecController {
  constructor(private readonly createExecService: CreateExecService) {}
  @Post()
  async CreateExec(@Body() body: any, @Auth() user: AuthUserSuccess) {
    return await this.createExecService.CreateExec(body, user);
  }
}
