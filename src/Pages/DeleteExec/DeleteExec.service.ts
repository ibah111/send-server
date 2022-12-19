import { LawExec } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { DeleteExecInput } from './DeleteExec.input';

@Injectable()
export class DeleteExecService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private ModelLawExec: typeof LawExec,
  ) {}
  async DeleteExec(
    body: DeleteExecInput,
    auth: AuthResult,
  ): Promise<number | false> {
    if (auth.userContact !== null) {
      const le = await this.ModelLawExec.findByPk(body.id);
      if (le !== null) {
        le.state = 6;
        await le.save();
        await le.$create('LawExecProtokol', {
          r_user_id: auth.userContact.id,
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
