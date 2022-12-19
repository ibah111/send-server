import {
  Address,
  Debt,
  Dict,
  LawAct,
  LawExec,
  Person,
  Portfolio,
} from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { SearchController } from './Search.controller';
import { SearchService } from './Search.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [Person, Portfolio, Debt, LawExec, Dict, Address, LawAct],
      'contact',
    ),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
