import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { SearchInput } from './Search.input';
import { SearchService } from './Search.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Search')
@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Post()
  @HttpCode(200)
  async search(@Body() body: SearchInput) {
    return await this.searchService.search(body);
  }
}
