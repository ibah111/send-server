import { LawCourt } from "@contact/models";
import { InjectModel } from "@contact/nestjs-sequelize";
import { Op } from "@contact/sequelize";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CourtService {
  constructor(@InjectModel(LawCourt) private ModelLawCourt: typeof LawCourt) {}
  async court(body: any) {
    const where: any = {};
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
      attributes: ["id", "name", "address"],
      limit: 25,
    });
  }
}
