import { Debt, DebtCalc, Dict, LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DebtCalcController } from './DebtCalc.controller';
import { DebtCalcService } from './DebtCalc.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Dict, LawExec, Debt, DebtCalc], 'contact'),
  ],
  controllers: [DebtCalcController],
  providers: [DebtCalcService],
})
export class DebtCalcModule {}
