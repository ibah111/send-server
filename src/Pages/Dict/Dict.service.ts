import { Dict, DictName } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { DictInput, getRawDictNamesClass } from './Dict.input';
import { Op } from 'sequelize';
@Injectable()
export class DictService {
  constructor(
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(DictName, 'contact')
    private readonly modelDictName: typeof DictName,
  ) {}
  async dict(body: DictInput) {
    return await this.ModelDict.findAll({
      where: { parent_id: body.id },
    });
  }

  async addDictNames() {
    return;
  }

  async getRawDictNames({ name }: getRawDictNamesClass) {
    const dictNames = await this.modelDictName.findAll({
      attributes: ['id', 'code', 'name', 'r_code', 'typ'],
      logging: console.log,
      where: {
        //@ts-expect-error ///
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
    });
    return dictNames;
  }
}
