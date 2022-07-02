import { Dict } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DictService {
  constructor(@InjectModel(Dict) private ModelDict: typeof Dict) {}
  async dict(body: any) {
    return await this.ModelDict.findAll({
      where: { parent_id: body.id },
    });
  }
}
