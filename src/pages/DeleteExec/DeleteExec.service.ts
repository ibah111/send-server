import { LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthUserSuccess } from 'src/utils/auth.guard';

@Injectable()
export class DeleteExecService {
  constructor(
    @InjectModel(User)
    private ModelUser: typeof User,
    @InjectModel(User)
    private ModelLawExec: typeof LawExec,
  ) {}
  async DeleteExec(body: any, user: AuthUserSuccess) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (OpUser !== null) {
      const le = await this.ModelLawExec.findByPk(body.id);
      if (le !== null) {
        le.state = 6;
        le.save();
        await le.$create('LawExecProtokol', {
          r_user_id: OpUser.id,
          typ: 23,
          dsc: `Перевод в архив`,
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
