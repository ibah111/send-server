import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { CreateExecInput } from './CreateExec.input';
import { CreateExecService } from './CreateExec.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('create_exec')
@ApiTags('LawExec')
@UseGuards(AuthGuard)
export class CreateExecController {
  constructor(private readonly createExecService: CreateExecService) {}
  @Post()
  async CreateExec(@Body() body: CreateExecInput, @Auth() auth: AuthResult) {
    return await this.createExecService.CreateExec(body, auth);
  }
}
