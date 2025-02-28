import { Sequelize } from '@sql-tools/sequelize-typescript';
import { Attributes, Op, WhereOptions } from '@sql-tools/sequelize';
import dottie from 'dottie';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import {
  Person,
  Portfolio,
  Debt,
  LawExec,
  Dict,
  Address,
  LawAct,
  LawExecPersonLink,
  DebtGuarantor,
} from '@contact/models';
import { Injectable } from '@nestjs/common';
import { SearchInput } from './Search.input';
@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Person, 'contact') private ModelPerson: typeof Person,
    @InjectModel(Portfolio, 'contact') private ModelPortfolio: typeof Portfolio,
    @InjectModel(Debt, 'contact') private ModelDebt: typeof Debt,
    @InjectModel(LawExec, 'contact') private ModelLawExec: typeof LawExec,
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(Address, 'contact') private ModelAddress: typeof Address,
    @InjectModel(LawAct, 'contact') private ModelLawAct: typeof LawAct,
    @InjectModel(LawExecPersonLink, 'contact')
    private readonly ModelLawExecPersonLink: typeof LawExecPersonLink,
    @InjectModel(DebtGuarantor, 'contact')
    private ModelDebtGuarantor: typeof DebtGuarantor,
  ) {}
  async search(body: SearchInput) {
    const result = await this.ModelLawExec.findAll({
      where: { state: { [Op.notIn]: [5] } },
      attributes: [
        'id',
        'court_doc_num',
        'executive_typ',
        'fssp_doc_num',
        'court_date',
        'entry_force_dt',
      ],
      include: [
        {
          model: this.ModelLawExecPersonLink,
          required: false,
          where: { PERSON_ROLE: 2 },
          include: [
            { model: this.ModelDebtGuarantor, attributes: ['id', 'fio'] },
          ],
        },
        {
          model: this.ModelDict,
          as: 'StateDict',
          attributes: ['name'],
        },
        {
          model: this.ModelLawAct,
          where: {
            [Op.or]: [
              { status: { [Op.notIn]: [10] }, typ: { [Op.in]: [1] } },
              {
                act_status: { [Op.notIn]: [15] },
                typ: { [Op.in]: [0, 2, 3, 4] },
              },
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
          ],
          attributes: ['id', 'typ', 'court_sum', 'exec_number'],
        },
        { model: this.ModelPortfolio, attributes: ['name'] },
        { model: this.ModelDict, as: 'ExecutiveTyp', attributes: ['name'] },
        {
          model: this.ModelDebt,
          attributes: {
            include: [
              'id',
              'contract',
              'debt_sum',
              'status',
              'name',
              [
                Sequelize.literal(
                  '(select sum(debt_calc.sum) as debt_payments_sum from debt_calc where debt_calc.parent_id = [Debt].[id] and is_cancel = 0)',
                ),
                'debt_payments_sum',
              ],
            ],
          },
          where: {
            status: { [Op.notIn]: [] },
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
        {
          model: this.ModelPerson,
          include: [
            {
              model: this.ModelAddress,
              where: {
                typ: 1,
                block_flag: { [Op.or]: [{ [Op.is]: null }, 0] },
              } as WhereOptions<Attributes<Address>>,
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
          attributes: [
            'id',
            'f',
            'i',
            'o',
            [Sequelize.literal("''"), 'fio'],
            'birth_date',
          ],
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: LawExec) =>
      dottie.flatten(res),
    );
  }
}
