import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { SearchDebtInput } from './SearchDebt.input';
import { SearchDebtService } from './SearchDebt.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Debt')
@Controller('search_debt')
@UseGuards(AuthGuard)
export class SearchDebtController {
  constructor(private readonly searchDebtService: SearchDebtService) {}
  @Post()
  @HttpCode(200)
  async search(@Body() body: SearchDebtInput) {
    return await this.searchDebtService.search(body);
  }
}
