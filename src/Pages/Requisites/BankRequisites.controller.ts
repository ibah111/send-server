import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BankRequisitesService from './BankRequisites.service';
import {
  BankRequisitesClass,
  SearchPortfolioInput,
} from './BankRequisites.input';

@ApiTags('BankRequisites')
@Controller('BankRequisites')
export class BankRequisitesController {
  constructor(private readonly bankRequisitesService: BankRequisitesService) {}
  @Get('getAllBankRequisites')
  getAllBankRequisites() {
    return this.bankRequisitesService.getAllRequisites();
  }

  @Post('getAllPortfolio')
  getAllPortfolios(@Body() body: SearchPortfolioInput) {
    return this.bankRequisitesService.getAllPortfolios(body);
  }

  @Get('getOneBankRequisites/:id')
  getOneBankRequisites(@Param('id', ParseIntPipe) id: number) {
    return this.bankRequisitesService.getOneBankRequisites(id);
  }

  @Post('addBankRequisites')
  addBankRequisites(@Body() body: BankRequisitesClass) {
    return this.bankRequisitesService.addBankRequisites(body);
  }

  @Put('updateBankRequisites/:id')
  dada(@Param('id') id: number, @Body() body: BankRequisitesClass) {
    return this.bankRequisitesService.updateBankRequisites(id, body);
  }
}
