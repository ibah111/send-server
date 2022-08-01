import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { DebtCalcInput } from './DebtCalc.input';
import { DebtCalcService } from './DebtCalc.service';

@Controller('debt_calc')
@UseGuards(AuthGuard)
export class DebtCalcController {
  constructor(private readonly debtCalcService: DebtCalcService) {}
  @Post()
  async get(@Body() body: DebtCalcInput) {
    return await this.debtCalcService.get(body.id);
  }
}
