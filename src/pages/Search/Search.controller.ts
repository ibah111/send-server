import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/utils/auth.guard";
import { SearchService } from "./Search.service";
@Controller("search")
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Post()
  @HttpCode(200)
  async search(@Body() body: any) {
    return await this.searchService.search(body);
  }
}
