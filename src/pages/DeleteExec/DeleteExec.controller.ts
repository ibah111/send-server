import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Auth, AuthUser } from 'src/utils/auth.guard';
import { DeleteExecService } from './DeleteExec.service';

@Controller('delete_exec')
export class DeleteExecController {
  constructor(private readonly deleteExecService: DeleteExecService) {}
  @Post()
  @HttpCode(200)
  async DeleteExec(@Body() body: any, @Auth() user: AuthUser) {
    return await this.deleteExecService.DeleteExec(body, user);
  }
}
