import { Sequelize } from '@contact/sequelize-typescript';
import { Op } from '@contact/sequelize';
import dottie from 'dottie';
import { InjectModel } from '@contact/nestjs-sequelize';
import {
  Address,
  Debt,
  Dict,
  LawAct,
  Person,
  Portfolio,
} from '@contact/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SearchLawActService {
  constructor(
    @InjectModel(LawAct) private ModelLawAct: typeof LawAct,
    @InjectModel(Dict) private ModelDict: typeof Dict,
    @InjectModel(Address) private ModelAddress: typeof Address,
    @InjectModel(Person) private ModelPerson: typeof Person,
    @InjectModel(Portfolio) private ModelPortfolio: typeof Portfolio,
    @InjectModel(Debt) private ModelDebt: typeof Debt,
  ) {}
  async searchLawAct(body: any) {
    const result = await this.ModelLawAct.findAll({
      attributes: ['id', 'typ'],
      where: {
        [Op.or]: [
          { status: { [Op.notIn]: [10] }, typ: { [Op.in]: [1] } },
          { act_status: { [Op.notIn]: [15] }, typ: { [Op.in]: [0, 2, 3, 4] } },
        ],
      },
      include: [
        {
          model: this.ModelDict,
          as: 'StatusDict',
          attributes: ['name'],
        },
        {
          model: this.ModelDict,
          as: 'ActStatusDict',
          attributes: ['name'],
        },
        {
          model: this.ModelPerson,
          include: [
            {
              model: this.ModelAddress,
              where: { typ: 1 },
              attributes: ['full_adr'],
              limit: 1,
            },
          ],
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
        { model: this.ModelPortfolio, attributes: ['name'] },
        {
          model: this.ModelDebt,
          attributes: ['id', 'contract', 'debt_sum'],
          where: {
            status: { [Op.notIn]: [7] },
            ...(body.contract ? { contract: body.contract } : {}),
          },
          include: [
            {
              model: this.ModelDict,
              as: 'StatusDict',
              attributes: ['name'],
            },
          ],
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: any) =>
      dottie.flatten(res),
    );
  }
}
