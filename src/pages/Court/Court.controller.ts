import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/utils/auth.guard";
import { CourtService } from "./Court.service";

@Controller("court")
@UseGuards(AuthGuard)
export class CourtController {
  constructor(private courtService: CourtService) {}
  @HttpCode(200)
  @Post()
  async court(@Body() body:any) {
    return await this.courtService.court(body);
  }
}
