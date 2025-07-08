import { Dict, DictName } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { DictInput, GetRawDictNamesClass } from './Dict.input';
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

  async getRawDictNames({ name, code }: GetRawDictNamesClass) {
    const dictNames = await this.modelDictName.findAll({
      attributes: ['id', 'code', 'name', 'r_code', 'typ'],
      //@ts-expect-error expecting error
      where: {
        code: code ? code : undefined,
        name: name ? { [Op.like]: `%${name}%` } : undefined,
      },
    });
    return dictNames;
  }
}
