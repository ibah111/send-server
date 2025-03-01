import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { UpdateDebtInput } from './UpdateDebt.input';
import { UpdateDebtService } from './UpdateDebt.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Debt')
@Controller('update_debt')
@UseGuards(AuthGuard)
export class UpdateDebtController {
  constructor(private readonly updateDebtService: UpdateDebtService) {}
  @HttpCode(200)
  @Post()
  async update(@Body() body: UpdateDebtInput, @Auth() auth: AuthResult) {
    return await this.updateDebtService.update(body, auth);
  }
}
