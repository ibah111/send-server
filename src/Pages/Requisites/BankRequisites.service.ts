import { Injectable } from '@nestjs/common';
import { Bank, BankRequisits, Portfolio } from '@contact/models';
import {
  BankRequisitesClass,
  SearchPortfolioInput,
} from './BankRequisites.input';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from 'sequelize';
import getSize from 'src/utils/getSize';
import { PortfoliosToRequisites } from 'src/Modules/Database/send.server.database/server.models/PortfolioToRequisites';

@Injectable()
export default class BankRequisitesService {
  constructor(
    @InjectModel(Portfolio, 'contact')
    private readonly modelPortfolio: typeof Portfolio,
    @InjectModel(BankRequisits, 'contact')
    private readonly modelBankRequisites: typeof BankRequisits,
    @InjectModel(Bank, 'contact')
    private readonly modelBank: typeof Bank,
    @InjectModel(PortfoliosToRequisites, 'send')
    private readonly modelPortfoliosToRequisites: typeof PortfoliosToRequisites,
  ) {}
  private bankAttributes = ['id', 'name', 'full_name', 'bank_address'];
  private portfolioAttributes = ['id', 'parent_id', 'name', 'sign_date'];
  private attributes = [
    'id',
    'name',
    'recipient',
    'br_name',
    'inn',
    'kpp',
    'r_account',
    'bik',
    'k_account',
    'pay_purpose',
    'br_address',
    'typ',
    'kbe',
    'knp',
    'kod',
  ];
  async getAllRequisites() {
    const requisites = await this.modelBankRequisites.findAll({
      attributes: this.attributes,
    });
    return requisites;
  }

  async getOneBankRequisites(id: number) {
    const requisite = await this.modelBankRequisites.findByPk(id, {
      attributes: this.attributes,
    });
    return requisite;
  }

  async addBankRequisites(b: BankRequisitesClass) {
    const requisites = this.modelBankRequisites.build();
    requisites.name = b.name;
    requisites.recipient = b.recipient;
    requisites.br_name = b.br_name;
    requisites.inn = b.inn;
    requisites.bik = b.bik;
    requisites.r_account = b.r_account;
    requisites.k_account = b.k_account;
    requisites.pay_purpose = b.pay_purpose;
    requisites.br_address = b.br_address;
    requisites.kpp = b.kpp;
    requisites.typ = b.typ;
    requisites.kbe = b.kbe;
    requisites.knp = b.knp;
    requisites.kod = b.kod;
    await requisites.save();
  }

  async updateBankRequisites(id: number, body: BankRequisitesClass) {
    const currentRequisites = await this.modelBankRequisites.findOne({
      rejectOnEmpty: true,
      where: {
        id,
      },
    });
    await currentRequisites.update({
      ...body,
    });
  }

  async getAllPortfolios(body: SearchPortfolioInput) {
    const all_linked_portfolios =
      await this.modelPortfoliosToRequisites.findAll();

    const ids = all_linked_portfolios.map(
      (item) => item.dataValues.r_portfolio_id,
    );
    const size = getSize(body.paginationModel.pageSize);
    const offset = body.paginationModel.page * size;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { count, rows } = await this.modelPortfolio.findAndCountAll({
      attributes: this.portfolioAttributes,
      offset,
      limit: size,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: {
        id: {
          [Op.notIn]: ids,
        },
        name: {
          [Op.like]: `%${body.name}%`,
        },
      },
      include: [
        {
          attributes: this.bankAttributes,
          model: this.modelBank,
        },
      ],
    });
    return {
      count,
      rows,
    };
  }
}
