import { LawCourt } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { FindOptions, Op } from '@sql-tools/sequelize';
import { Injectable } from '@nestjs/common';
import { CourtInput, LawCourtInput } from './Court.input';

@Injectable()
export class CourtService {
  constructor(
    @InjectModel(LawCourt, 'contact') private ModelLawCourt: typeof LawCourt,
  ) {}
  async court(body: CourtInput) {
    if (body.data?.name) {
      body.name = body.data.name;
    }
    const where: FindOptions['where'] = {};
    if (body.id) where.id = body.id;
    if (body.name) {
      where.name = { [Op.like]: `%${body.name}%` };
      where.id = { [Op.gte]: 74643 };
    }
    if (!body.id && !body.name) {
      where.id = { [Op.gte]: 74643 };
    }

    return await this.ModelLawCourt.findAll({
      where: { typ: 2, ...where },
      attributes: ['id', 'name', 'address', 'district'],
      limit: 25,
    });
  }

  async AddLawCourt(body: LawCourtInput) {
    try {
      const createInstance = await this.ModelLawCourt.create({
        ...body,
      });
      return createInstance;
    } catch (error) {
      console.log(error);
      throw Error('Ошибка в добавлени ФССП');
    }
  }
}
