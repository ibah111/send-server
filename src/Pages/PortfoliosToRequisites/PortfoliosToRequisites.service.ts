import { BankRequisits, Debt, Portfolio } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { PortfoliosToRequisites } from 'src/Modules/Database/send.server.database/server.models/PortfolioToRequisites';

@Injectable()
export default class PortfoliosToRequisitesService {
  constructor(
    @InjectModel(Debt, 'contact') private readonly modelDebt: typeof Debt,
    @InjectModel(BankRequisits, 'contact')
    private readonly modelBankRequisites: typeof BankRequisits,
    @InjectModel(Portfolio, 'contact')
    private readonly modelPortfolio: typeof Portfolio,
    @InjectModel(PortfoliosToRequisites, 'send')
    private readonly modelPortfoliosToRequisites: typeof PortfoliosToRequisites,
  ) {}
}
