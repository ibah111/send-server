import { Debt, LawAct, LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { UpdateDebtController } from './UpdateDebt.controller';
import { UpdateDebtService } from './UpdateDebt.service';

@Module({
  imports: [SequelizeModule.forFeature([Debt, LawExec, LawAct], 'contact')],
  controllers: [UpdateDebtController],
  providers: [UpdateDebtService],
})
export class UpdateDebtModule {}
