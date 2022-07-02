import { Debt, LawExec, Person } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { LawExecInput } from './LawExec.input';
@Injectable()
export class LawExecService {
  constructor(
    @InjectModel(LawExec) private ModelLawExec: typeof LawExec,
    @InjectModel(Person) private ModelPerson: typeof Person,
    @InjectModel(Debt) private ModelDebt: typeof Debt,
  ) {}
  async law_exec(body: LawExecInput) {
    return await this.ModelLawExec.findOne({
      where: { id: body.id },
      include: [
        { model: this.ModelPerson, attributes: ['f', 'i', 'o'] },
        { model: this.ModelDebt, attributes: ['contract'] },
      ],
    });
  }
}
