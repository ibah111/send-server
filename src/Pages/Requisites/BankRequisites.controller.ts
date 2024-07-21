import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BankRequisitesService from './BankRequisites.service';
import { BankRequisitesClass } from './BankRequisites.input';

@ApiTags('BankRequisites')
@Controller('BankRequisites')
export class BankRequisitesController {
  constructor(private readonly bankRequisitesService: BankRequisitesService) {}
  @Get('getAllBankRequisites')
  getAllBankRequisites() {
    return this.bankRequisitesService.getAllRequisites();
  }

  @Get('getOneRequisites/:id')
  getOneBankReq(@Param('id') id: number) {
    return this.bankRequisitesService.getOneRequisites(id);
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
