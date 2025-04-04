import {
  Debt,
  DebtCalc,
  DebtGuarantor,
  LawAct,
  LawExec,
  LawExecPersonLink,
  Person,
  PersonProperty,
  PersonPropertyParam,
  Portfolio,
} from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { LawExecController } from './LawExec.controller';
import { LawExecService } from './LawExec.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [
        LawExec,
        Person,
        Debt,
        Portfolio,
        LawExecPersonLink,
        DebtGuarantor,
        PersonProperty,
        PersonPropertyParam,
        DebtCalc,
        LawAct,
      ],
      'contact',
    ),
  ],
  controllers: [LawExecController],
  providers: [LawExecService],
})
export class LawExecModule {}
