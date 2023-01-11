import { LawAct, LawExec } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { CreateExecInput } from './CreateExec.input';
import { CreationAttributes } from '@sql-tools/sequelize';
@Injectable()
export class CreateExecService {
  constructor(
    @InjectModel(LawAct, 'contact')
    private ModelLawAct: typeof LawAct,
  ) {}
  async CreateExec(
    body: CreateExecInput,
    auth: AuthResult,
  ): Promise<boolean | number> {
    if (auth.userContact !== null) {
      const la = await this.ModelLawAct.findByPk(body.id);
      const debt = await la!.$get('Debt');
      let user_id = 17;
      const work_task = await debt!.$get('WorkTasks');
      if (work_task.length > 0)
        if (work_task[0].r_user_id !== null) user_id = work_task[0].r_user_id;
      if (la !== null) {
        const data: CreationAttributes<LawExec> = {
          r_person_id: la.r_person_id,
          r_debt_id: la.r_debt_id,
          r_portfolio_id: la.r_portfolio_id,
          state: 5,
          r_user_id: user_id,
          load_dt: new Date(),
          DELIVERY_TYP: 3,
          contract: debt!.contract,
          currency: 1,
          total_sum: 0,
          ...body.old,
          dsc: 'Создается ИП из "Отправка"',
        };
        const le: LawExec = await la.$create('LawExec', data);
        await le.$create('LawExecPersonLink', { PERSON_ID: la.r_person_id });
        await le.$create('LawExecProtokol', {
          r_user_id: auth.userContact.id,
          typ: 1,
          dsc: `Создание ИД из "Отправки" со значениями: Статус - (5) Аннулировано, Тип доставки - (3) Курьером, Договор - ${
            debt!.contract
          }`,
        });
        return le.id;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
