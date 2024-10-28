import { LawAct, LawExec } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { GetCommentInput } from './GetComment.input';

@Injectable()
export class GetCommentService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private ModelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact')
    private ModelLawAct: typeof LawAct,
  ) {}
  async GetComment(body: GetCommentInput) {
    switch (body.type) {
      case 'law_act':
        return await this.ModelLawAct.findOne({
          where: { id: body.id },
          attributes: ['dsc'],
        });
      case 'law_exec':
        return await this.ModelLawExec.findOne({
          where: { id: body.id },
          include: { model: this.ModelLawAct, attributes: ['dsc'] },
          attributes: ['dsc'],
        });
    }
  }
}
