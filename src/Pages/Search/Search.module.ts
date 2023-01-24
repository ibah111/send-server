import {
  Address,
  Debt,
  DebtGuarantor,
  Dict,
  LawAct,
  LawExec,
  LawExecPersonLink,
  Person,
  Portfolio,
} from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { SearchController } from './Search.controller';
import { SearchService } from './Search.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [
        Person,
        Portfolio,
        Debt,
        LawExec,
        Dict,
        Address,
        LawAct,
        DebtGuarantor,
        LawExecPersonLink,
      ],
      'contact',
    ),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
