import { LawAct, LawExec } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { AddCommentInput } from './AddComment.input';
@Injectable()
export class AddCommentService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private ModelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact')
    private ModelLawAct: typeof LawAct,
  ) {}
  async AddComment(body: AddCommentInput, auth: AuthResult) {
    if (body.id && body.value) {
      const le = await this.ModelLawExec.findByPk(body.id);
      if (le) {
        if (body.law_exec) {
          if (!le!.dsc) {
            le.dsc = '';
          } else {
            le.dsc += '\r\n';
          }
          le.dsc += body.value;
          await le.$create('LawExecProtokol', {
            r_user_id: auth.userContact!.id,
            typ: 2,
            dsc: `Комментарий. Добавлена строка: "${body.value}".`,
          });
          await le.save();
        }

        if (body.law_act && le.r_act_id) {
          const la = await this.ModelLawAct.findByPk(le.r_act_id);
          if (la) {
            if (!la.dsc) {
              la.dsc = '';
            } else {
              la.dsc += '\r\n';
            }
            la.dsc += body.value;
            await la.$create('LawActProtokol', {
              r_user_id: auth.userContact!.id,
              typ: 2,
              dsc: `Комментарий. Добавлена строка: "${body.value}".`,
            });
            await la.save();
          }
        }
        return true;
      }
    }
    return false;
  }
}
