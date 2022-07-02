import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { SearchLawActInput } from './SearchLawAct.input';
import { SearchLawActService } from './SearchLawAct.service';
@Controller('search_la')
@UseGuards(AuthGuard)
export class SearchLawActController {
  constructor(private readonly searchLawActService: SearchLawActService) {}
  @Post()
  @HttpCode(200)
  async searchLawAct(@Body() body: SearchLawActInput) {
    return await this.searchLawActService.searchLawAct(body);
  }
}
