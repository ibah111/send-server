import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { BankRequisitesController } from './BankRequisites.controller';
import BankRequisitesService from './BankRequisites.service';
import { Bank, BankRequisits, Portfolio } from '@contact/models';
import { PortfoliosToRequisites } from 'src/Modules/Database/send.server.database/server.models/PortfolioToRequisites';

@Module({
  imports: [
    SequelizeModule.forFeature([PortfoliosToRequisites], 'send'),
    SequelizeModule.forFeature([BankRequisits, Portfolio, Bank], 'contact'),
  ],
  controllers: [BankRequisitesController],
  providers: [BankRequisitesService],
})
export class RequisitesModule {}
