import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { DeleteExecInput } from './DeleteExec.input';
import { DeleteExecService } from './DeleteExec.service';

@Controller('delete_exec')
@UseGuards(AuthGuard)
export class DeleteExecController {
  constructor(private readonly deleteExecService: DeleteExecService) {}
  @Post()
  @HttpCode(200)
  async DeleteExec(@Body() body: DeleteExecInput, @Auth() auth: AuthResult) {
    return await this.deleteExecService.DeleteExec(body, auth);
  }
}
