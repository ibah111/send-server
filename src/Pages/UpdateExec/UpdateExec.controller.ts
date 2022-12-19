import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { UpdateExecInput } from './UpdateExec.input';
import { UpdateExecService } from './UpdateExec.service';
@Controller('update_exec')
@UseGuards(AuthGuard)
export class UpdateExecController {
  constructor(private readonly updateExecService: UpdateExecService) {}
  @Post()
  @HttpCode(200)
  async update(@Body() body: UpdateExecInput, @Auth() auth: AuthResult) {
    return await this.updateExecService.update(body, auth);
  }
}
