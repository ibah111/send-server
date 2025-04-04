import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import PortfoliosToRequisitesController from './PortfoliosToRequisites.controller';
import { PortfoliosToRequisites } from 'src/Modules/Database/send.server.database/server.models/PortfolioToRequisites';
import PortfoliosToRequisitesService from './PortfoliosToRequisites.service';
import { BankRequisits, Debt, LawExec, Portfolio } from '@contact/models';

@Module({
  imports: [
    SequelizeModule.forFeature([PortfoliosToRequisites], 'send'),
    SequelizeModule.forFeature(
      [Debt, Portfolio, BankRequisits, LawExec],
      'contact',
    ),
  ],
  controllers: [PortfoliosToRequisitesController],
  providers: [PortfoliosToRequisitesService],
  exports: [PortfoliosToRequisitesService],
})
export default class PortfoliosToRequisitesModule {}
