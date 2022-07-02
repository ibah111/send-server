import { LawAct, LawExec } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCommentService {
  constructor(
    @InjectModel(LawExec)
    private ModelLawExec: typeof LawExec,
    @InjectModel(LawAct)
    private ModelLawAct: typeof LawAct,
  ) {}
  async GetComment(body: any) {
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
