import { Debt, LawAct, LawExec, LawExecProtokol, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthUserSuccess } from 'src/Modules/Guards/auth.guard';
import { UpdateDebtInput } from './UpdateDebt.input';

@Injectable()
export class UpdateDebtService {
  constructor(
    @InjectModel(Debt) private readonly ModelDebt: typeof Debt,
    @InjectModel(LawExec) private readonly ModelLawExec: typeof LawExec,
    @InjectModel(LawAct) private readonly ModelLawAct: typeof LawAct,
    @InjectModel(User) private readonly ModelUser: typeof User,
  ) {}
  async update(body: UpdateDebtInput, user: AuthUserSuccess) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (body.law_exec_id) {
      const law_exec = await this.ModelLawExec.findByPk(body.law_exec_id);
      const law_act = await law_exec!.$get('LawAct');
      const debt_old = await law_act!.$get('Debt');
      const debt_new = await this.ModelDebt.findByPk(body.debt_id);
      law_exec!.r_person_id = debt_new!.parent_id;
      law_exec!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_exec!.r_debt_id = debt_new!.id;
      await law_exec!.$create<LawExecProtokol>('LawExecProtokol', {
        r_user_id: OpUser!.id,
        typ: 6,
        dsc: `Была осуществлена перепривязка с долга ${debt_old!.id} на ${
          debt_new!.id
        }`,
      });
      await law_exec!.save();
      law_act!.r_person_id = debt_new!.parent_id;
      law_act!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_act!.r_debt_id = debt_new!.id;
      await law_act!.$create<LawExecProtokol>('LawActProtokol', {
        r_user_id: OpUser!.id,
        typ: 105,
        dsc: `Была осуществлена перепривязка с долга ${debt_old!.id} на ${
          debt_new!.id
        }`,
      });
      await law_act!.save();
      return true;
    }
    if (body.law_act_id) {
      const law_act = await this.ModelLawAct.findByPk(body.law_act_id);
      const debt_old = await law_act!.$get('Debt');
      const debt_new = await this.ModelDebt.findByPk(body.debt_id);
      law_act!.r_person_id = debt_new!.parent_id;
      law_act!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_act!.r_debt_id = debt_new!.id;
      await law_act!.$create<LawExecProtokol>('LawActProtokol', {
        r_user_id: OpUser!.id,
        typ: 105,
        dsc: `Была осуществлена перепривязка с долга ${debt_old!.id} на ${
          debt_new!.id
        }`,
      });
      await law_act!.save();
      return true;
    }
  }
}
