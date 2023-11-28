import { Debt, LawAct, LawExec } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { UpdateDebtInput } from './UpdateDebt.input';

@Injectable()
export class UpdateDebtService {
  constructor(
    @InjectModel(Debt, 'contact') private readonly ModelDebt: typeof Debt,
    @InjectModel(LawExec, 'contact')
    private readonly ModelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact') private readonly ModelLawAct: typeof LawAct,
  ) {}
  async update(body: UpdateDebtInput, auth: AuthResult) {
    if (body.law_exec_id) {
      const law_exec = await this.ModelLawExec.findByPk(body.law_exec_id);
      const law_act = await law_exec!.getLawAct();
      const debt_old = await law_act!.getDebt();
      const debt_new = await this.ModelDebt.findByPk(body.debt_id);
      law_exec!.r_person_id = debt_new!.parent_id;
      law_exec!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_exec!.r_debt_id = debt_new!.id;
      await law_exec!.createLawExecProtokol({
        r_user_id: auth.userContact!.id,
        typ: 6,
        dsc: `Была осуществлена перепривязка с долга ${debt_old!.id} на ${
          debt_new!.id
        }`,
      });
      await law_exec!.save();
      law_act!.r_person_id = debt_new!.parent_id;
      law_act!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_act!.r_debt_id = debt_new!.id;
      await law_act!.createLawActProtokol({
        r_user_id: auth.userContact!.id,
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
      const debt_old = await law_act!.getDebt();
      const debt_new = await this.ModelDebt.findByPk(body.debt_id);
      law_act!.r_person_id = debt_new!.parent_id;
      law_act!.r_portfolio_id = debt_new!.r_portfolio_id;
      law_act!.r_debt_id = debt_new!.id;
      await law_act!.createLawActProtokol({
        r_user_id: auth.userContact!.id,
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
