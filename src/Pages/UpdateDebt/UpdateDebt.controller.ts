import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  Auth,
  AuthGuard,
  AuthUserSuccess,
} from 'src/Modules/Guards/auth.guard';
import { UpdateDebtInput } from './UpdateDebt.input';
import { UpdateDebtService } from './UpdateDebt.service';

@Controller('update_debt')
@UseGuards(AuthGuard)
export class UpdateDebtController {
  constructor(private readonly updateDebtService: UpdateDebtService) {}
  @HttpCode(200)
  @Post()
  async update(@Body() body: UpdateDebtInput, @Auth() user: AuthUserSuccess) {
    return await this.updateDebtService.update(body, user);
  }
}
