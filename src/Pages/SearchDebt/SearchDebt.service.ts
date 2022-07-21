import { Address, Debt, Dict, Person, Portfolio } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Op } from '@contact/sequelize';
import { Sequelize } from '@contact/sequelize-typescript';
import { Injectable } from '@nestjs/common';
import dottie from 'dottie';
import { SearchDebtInput } from './SearchDebt.input';
@Injectable()
export class SearchDebtService {
  constructor(
    @InjectModel(Dict) private ModelDict: typeof Dict,
    @InjectModel(Person) private ModelPerson: typeof Person,
    @InjectModel(Portfolio) private ModelPortfolio: typeof Portfolio,
    @InjectModel(Debt) private ModelDebt: typeof Debt,
  ) {}
  async search(body: SearchDebtInput) {
    const result = await this.ModelDebt.findAll({
      attributes: ['id', 'contract', 'debt_sum'],
      where: {
        status: { [Op.notIn]: [7] },
        ...(body.contract ? { contract: body.contract } : {}),
      },
      include: [
        { model: this.ModelPortfolio, attributes: ['name'] },
        {
          model: this.ModelDict,
          as: 'StatusDict',
          attributes: ['name'],
        },
        {
          model: this.ModelPerson,
          where: body.name
            ? Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.col('f'),
                  ' ',
                  Sequelize.col('i'),
                  ' ',
                  Sequelize.col('o'),
                ),
                { [Op.like]: `%${body.name}%` },
              )
            : {},
          attributes: ['id', 'f', 'i', 'o', [Sequelize.literal("''"), 'fio']],
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: any) =>
      dottie.flatten(res),
    );
  }
}
