import { LawAct, LawExec } from '@contact/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import UpdateCommentsInput from './UpdateComments.input';

@Injectable()
export default class UpdateCommentService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact') private readonly modelLawAct: typeof LawAct,
  ) {}

  async updateComments({
    law_exec_id,
    law_act_comment: law_act_comment,
    law_exec_comment: law_exec_comment,
  }: UpdateCommentsInput) {
    const LE = await this.modelLawExec.findOne({
      where: {
        id: law_exec_id,
      },
      rejectOnEmpty: new NotFoundException('Испол. пр-во не найдено'),
    });
    const law_act_id = LE.r_act_id! as number;
    const LA = await this.modelLawAct.findOne({
      where: {
        id: law_act_id,
      },
      rejectOnEmpty: new NotFoundException('Суд. работа не найдена'),
    });
    try {
      await LE.update({
        dsc: law_exec_comment,
      });
      LA.update({
        dsc: law_act_comment,
      });
    } catch (error) {}
  }
}
