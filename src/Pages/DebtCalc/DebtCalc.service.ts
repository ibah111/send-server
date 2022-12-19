import { Debt, DebtCalc, Dict, LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebtCalcService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly ModelLawExec: typeof LawExec,
    @InjectModel(Debt, 'contact') private readonly ModelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly ModelDebtCalc: typeof DebtCalc,
    @InjectModel(Dict, 'contact') private readonly ModelDict: typeof Dict,
  ) {}
  async get(id: number): Promise<DebtCalc[]> {
    const result = await this.ModelLawExec.findOne({
      where: { id },
      attributes: ['r_debt_id'],
      include: [
        {
          model: this.ModelDebt,
          attributes: ['id'],
          include: [
            {
              model: this.ModelDebtCalc,
              required: false,
              include: [
                { model: this.ModelDict, as: 'PurposeDict', required: false },
              ],
              where: { is_confirmed: 1, is_cancel: 0 },
            },
          ],
        },
      ],
    });
    return result!.Debt!.DebtCalcs!;
  }
}
