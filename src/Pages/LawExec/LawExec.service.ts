import { Debt, LawExec, Person, Portfolio } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { LawExecInput } from './LawExec.input';
@Injectable()
export class LawExecService {
  constructor(
    @InjectModel(LawExec, 'contact') private ModelLawExec: typeof LawExec,
    @InjectModel(Person, 'contact') private ModelPerson: typeof Person,
    @InjectModel(Debt, 'contact') private ModelDebt: typeof Debt,
    @InjectModel(Portfolio, 'contact') private ModelPortfolio: typeof Portfolio,
  ) {}
  async law_exec(body: LawExecInput) {
    return await this.ModelLawExec.findOne({
      where: { id: body.id },
      include: [
        { model: this.ModelPerson, attributes: ['f', 'i', 'o'] },
        { model: this.ModelDebt, attributes: ['contract'] },
        { model: this.ModelPortfolio, attributes: ['name'] },
      ],
    });
  }
}
