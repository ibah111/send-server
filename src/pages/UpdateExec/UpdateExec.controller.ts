import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Auth, AuthUserSuccess } from 'src/utils/auth.guard';
import { UpdateExecService } from './UpdateExec.service';
@Controller('update_exec')
export class UpdateExecController {
  constructor(private readonly updateExecService: UpdateExecService) {}
  @Post()
  @HttpCode(200)
  async update(@Body() body: any, @Auth() user: AuthUserSuccess) {
    return await this.updateExecService.update(body, user);
  }
}
