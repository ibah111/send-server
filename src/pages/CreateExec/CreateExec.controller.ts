import { Body, Controller, Post } from "@nestjs/common";
import { Auth, AuthUser } from "src/utils/auth.guard";
import { CreateExecService } from "./CreateExec.service";
@Controller("create_exec")
export class CreateExecController {
  constructor(private readonly createExecService: CreateExecService) {}
  @Post()
  async CreateExec(@Body() body: any, @Auth() user: AuthUser) {
    return await this.createExecService.CreateExec(body, user);
  }
}
