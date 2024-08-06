import { Bank, BankRequisits, Debt, LawExec, Portfolio } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from 'sequelize';
import { PortfoliosToRequisites } from 'src/Modules/Database/send.server.database/server.models/PortfolioToRequisites';

class CreateLinkInput {
  r_portfolio_ids: number[];
  r_requisites_id: number;
}

class DeleteLinkInput {
  r_portfolio_id: number;
  r_requisites_id: number;
}
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
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
  ) {}

  async getAllLinksByRequisites(requisites_id: number) {
    try {
      const result = await this.modelPortfoliosToRequisites.findAll({
        where: {
          r_requisites_id: requisites_id,
        },
      });
      if (result.length > 0) {
        const result_ids: number[] = result.map(
          (item) => item.dataValues.r_portfolio_id,
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const portfolios = await this.modelPortfolio.findAll({
          //@ts-expect-error type error
          where: {
            id: {
              [Op.in]: result_ids,
            },
          },
          include: [
            {
              model: Bank,
              attributes: ['id', 'name', 'full_name'],
            },
          ],
        });
        return portfolios;
      }
      return [];
    } catch (error) {
      throw Error('Error getting all links by requisites');
    }
  }

  private async getRequisitesByPortfolio(portfolio_id: number) {
    try {
      const link = await this.modelPortfoliosToRequisites.findOne({
        where: {
          r_portfolio_id: portfolio_id,
        },
      });
      return link;
    } catch (error) {
      throw Error('Error with getting requisited by portfolio_id');
    }
  }

  async getRequisitesByLawExecId(law_exec_id: number) {
    const law_exec = await this.modelLawExec.findOne({
      where: {
        id: law_exec_id,
      },
      include: [
        {
          required: true,
          model: this.modelDebt,
          include: [
            {
              model: this.modelPortfolio,
            },
          ],
        },
      ],
      rejectOnEmpty: true,
    });
    try {
      const link = await this.getRequisitesByPortfolio(
        law_exec.r_portfolio_id!,
      );
      if (link === null) {
        //default "no link" requisites_id
        return 8;
      } else {
        return link.dataValues.r_requisites_id;
      }
    } catch (error) {
      console.log(error);
      throw Error('Get requisites by portfolio error');
    }
  }

  async createPortfolioToRequisitesLink({
    r_portfolio_ids,
    r_requisites_id,
  }: CreateLinkInput) {
    for (const r_portfolio_id of r_portfolio_ids) {
      const is_exist = await this.modelPortfoliosToRequisites.findOne({
        where: {
          r_requisites_id: r_requisites_id,
          r_portfolio_id: r_portfolio_id,
        },
      });
      if (is_exist === null) {
        await this.modelPortfoliosToRequisites.create({
          r_portfolio_id: r_portfolio_id,
          r_requisites_id: r_requisites_id,
        });
      } else {
        throw Error('Связь существует');
      }
    }
  }

  async deletePortfolioToRequisitesLink({
    r_portfolio_id,
    r_requisites_id,
  }: DeleteLinkInput) {
    const link = await this.modelPortfoliosToRequisites.findOne({
      where: {
        r_portfolio_id: r_portfolio_id,
        r_requisites_id: r_requisites_id,
      },
      rejectOnEmpty: Error('Связь не найдена'),
    });
    link.destroy();
  }
}
