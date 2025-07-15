import { Dict, DictName } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { DictInput, GetRawDictNamesClass } from './Dict.input';
import { Op } from '@sql-tools/sequelize';
@Injectable()
export class DictService {
  constructor(
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(DictName, 'contact')
    private readonly modelDictName: typeof DictName,
  ) {}
  async dict(body: DictInput) {
    return await this.ModelDict.findAll({
      attributes: ['id', 'code', 'name', 'r_code', 'typ'],
      where: {
        parent_id: body.id,
        ...(body.name && {
          [Op.and]: [{ name: { [Op.like]: `%${body.name}%` } }],
        }),
        ...(body.not_in_ids && { code: { [Op.notIn]: body.not_in_ids } }),
        ...(body.not_in_names && {
          name: { [Op.notIn]: body.not_in_names },
        }),
      },
    });
  }

  async getRawDictNames({ name, code }: GetRawDictNamesClass) {
    const dictNames = await this.modelDictName.findAll({
      attributes: ['id', 'code', 'name', 'r_code', 'typ'],
      where: {
        code: code ? code : undefined,
        name: name ? { [Op.like]: `%${name}%` } : undefined,
      },
    });
    return dictNames;
  }
}
