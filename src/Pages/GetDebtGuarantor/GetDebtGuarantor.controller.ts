import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetDebtGuarantorInput } from './GetDebtGuarantor.input';
import { GetDebtGuarantorService } from './GetDebtGuarantor.service';

@Controller('get_debt_guarantor')
export class GetDebtGuarantorController {
  constructor(private readonly service: GetDebtGuarantorService) {}
  @HttpCode(200)
  @Post()
  get(@Body() body: GetDebtGuarantorInput) {
    return this.service.get(body.id);
  }
}
