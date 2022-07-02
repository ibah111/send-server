import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  Auth,
  AuthGuard,
  AuthUserSuccess,
} from 'src/Modules/Guards/auth.guard';
import { UpdateExecService } from './UpdateExec.service';
@Controller('update_exec')
@UseGuards(AuthGuard)
export class UpdateExecController {
  constructor(private readonly updateExecService: UpdateExecService) {}
  @Post()
  @HttpCode(200)
  async update(@Body() body: any, @Auth() user: AuthUserSuccess) {
    return await this.updateExecService.update(body, user);
  }
}
