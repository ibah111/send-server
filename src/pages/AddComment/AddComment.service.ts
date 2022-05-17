import { LawAct, LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthUser } from 'src/utils/auth.guard';
@Injectable()
export class AddCommentService {
  constructor(
    @InjectModel(User)
    private ModelUser: typeof User,
    @InjectModel(LawExec)
    private ModelLawExec: typeof LawExec,
    @InjectModel(LawAct)
    private ModelLawAct: typeof LawAct,
  ) {}
  async AddComment(body: any, user: AuthUser) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (body.id && body.value) {
      const le = await this.ModelLawExec.findByPk(body.id);
      if (body.law_exec) {
        if (!le.dsc) {
          le.dsc = '';
        } else {
          le.dsc += '\r\n';
        }
        le.dsc += body.value;
        await le.$create("LawExecProtokol",{
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Добавлена строка: "${body.value}".`,
        });
        await le.save();
      }
      if (body.law_act && le.r_act_id) {
        const la = await this.ModelLawAct.findByPk(le.r_act_id);
        if (!la.dsc) {
          la.dsc = '';
        } else {
          la.dsc += '\r\n';
        }
        la.dsc += body.value;
        await la.$create("LawActProtokol",{
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Добавлена строка: "${body.value}".`,
        });
        await la.save();
      }
      return true;
    } else {
      return false;
    }
  }
}
