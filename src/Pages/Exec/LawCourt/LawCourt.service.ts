import { LawCourt } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { LawCourtInput } from './LawCourt.input';

@Injectable()
export class LawCourtService {
  constructor(
    @InjectModel(LawCourt, 'contact')
    private readonly modelLawCourt: typeof LawCourt,
  ) {}

  async AddLawCourt(body: LawCourtInput) {
    const createInstance = await this.modelLawCourt.create({
      ...body,
    });
    return createInstance;
  }
}
