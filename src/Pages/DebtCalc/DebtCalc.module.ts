import { Debt, DebtCalc, Dict, LawExec } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DebtCalcController } from './DebtCalc.controller';
import { DebtCalcService } from './DebtCalc.service';

@Module({
  imports: [SequelizeModule.forFeature([Dict, LawExec, Debt, DebtCalc])],
  controllers: [DebtCalcController],
  providers: [DebtCalcService],
})
export class DebtCalcModule {}
