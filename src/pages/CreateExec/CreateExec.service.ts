import { LawAct, LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthUserSuccess } from 'src/utils/auth.guard';
@Injectable()
export class CreateExecService {
  constructor(
    @InjectModel(User)
    private ModelUser: typeof User,
    @InjectModel(LawAct)
    private ModelLawAct: typeof LawAct,
  ) {}
  async CreateExec(body: any, user: AuthUserSuccess) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (OpUser !== null) {
      const la = await this.ModelLawAct.findByPk(body.id);
      const debt = await la.$get('Debt');
      let user_id = 17;
      const work_task = await debt.$get('WorkTasks');
      if (work_task.length > 0)
        if (work_task[0].r_user_id !== null) user_id = work_task[0].r_user_id;
      if (la !== null) {
        const le:LawExec = await la.$create("LawExec",{
          r_person_id: la.r_person_id,
          r_debt_id: la.r_debt_id,
          r_portfolio_id: la.r_portfolio_id,
          state: 5,
          r_user_id: user_id,
          DELIVERY_TYP: 3,
          contract: debt.contract,
          currency: 1,
          ...body.old,
          dsc: 'Создается ИП из "Отправка"',
        });
        await le.$create("LawExecPersonLink",{ PERSON_ID: la.r_person_id });
        await le.$create("LawExecProtokol",{
          r_user_id: OpUser.id,
          typ: 1,
          dsc: `Создание ИД из "Отправки" со значениями: Статус - (5) Аннулировано, Тип доставки - (3) Курьером, Договор - ${debt.contract}`,
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
