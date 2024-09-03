import {
  Debt,
  DebtCalc,
  DebtGuarantor,
  LawAct,
  LawExec,
  LawExecPersonLink,
  Person,
  PersonProperty,
  Portfolio,
} from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { LawExecInput } from './LawExec.input';
import { Sequelize } from 'sequelize';
@Injectable()
export class LawExecService {
  constructor(
    @InjectModel(LawExec, 'contact') private ModelLawExec: typeof LawExec,
    @InjectModel(Person, 'contact') private ModelPerson: typeof Person,
    @InjectModel(Debt, 'contact') private ModelDebt: typeof Debt,
    @InjectModel(Portfolio, 'contact') private ModelPortfolio: typeof Portfolio,
    @InjectModel(LawExecPersonLink, 'contact')
    private readonly ModelLawExecPersonLink: typeof LawExecPersonLink,
    @InjectModel(DebtGuarantor, 'contact')
    private readonly ModelDebtGuarantor: typeof DebtGuarantor,
    @InjectModel(PersonProperty, 'contact')
    private readonly ModelPersonProperty: typeof PersonProperty,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
    @InjectModel(LawAct, 'contact')
    private readonly modelLawAct: typeof LawAct,
  ) {}
  async law_exec(body: LawExecInput) {
    return await this.ModelLawExec.findOne({
      where: { id: body.id },
      include: [
        {
          attributes: ['exec_number', 'court_sum'],
          model: this.modelLawAct,
        },
        { model: this.ModelPerson, attributes: ['f', 'i', 'o'] },
        {
          model: this.ModelDebt,
          attributes: {
            include: ['id', 'contract'],
          },
          include: [
            {
              model: this.ModelPersonProperty,
              include: ['PersonPropertyParams', 'StatusDict'],
            },
            { model: this.ModelDebtGuarantor },
            {
              model: this.modelDebtCalc,
              attributes: ['id', 'sum', 'is_confirmed', 'is_cancel'],
              where: {
                is_cancel: 0,
              },
            },
          ],
        },
        { model: this.ModelPortfolio, attributes: ['name'] },
        {
          model: this.ModelLawExecPersonLink,
          required: false,
          where: { PERSON_ROLE: 2 },
          include: [this.ModelDebtGuarantor],
        },
      ],
    });
  }
}
