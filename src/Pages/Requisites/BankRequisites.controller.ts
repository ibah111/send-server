import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BankRequisitesService from './BankRequisites.service';

@ApiTags('BankRequisites')
@Controller('BankRequisites')
export class BankRequisitesController {
  constructor(private readonly bankRequisitesService: BankRequisitesService) {}
  @Post('getAllBankRequisites')
  getAllBankRequisites() {
    return this.bankRequisitesService.getAllRequisites();
  }

  @Post('addBankRequisites')
  addBankRequisites() {
    return this.bankRequisitesService.addBankRequisites();
  }
}
