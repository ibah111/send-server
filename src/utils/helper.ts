import { Dict, LawCourt } from '@contact/models';
import { InjectModel, SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Injectable, Module } from '@nestjs/common';
import moment from 'moment';
@Injectable()
export class Helper {
  constructor(
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(LawCourt, 'contact') private ModelLawCourt: typeof LawCourt,
  ) {}
  async help(typ: string, value: unknown) {
    switch (typ) {
      case 'load_dt':
        if (value) return moment(value).format('DD.MM.YYYY');
      case 'state':
        if (value) {
          const data = await this.ModelDict.findOne({
            where: { parent_id: 77, code: value },
          });
          if (data) return data.name;
        }
      case 'executive_typ':
        if (value) {
          const data = await this.ModelDict.findOne({
            where: { parent_id: 124, code: value },
          });
          if (data) return data.name;
        }
      case 'court_date':
        if (value) return moment(value).format('DD.MM.YYYY');
      case 'DELIVERY_TYP':
        if (value) {
          const data = await this.ModelDict.findOne({
            where: { parent_id: 16, code: value },
          });
          if (data) return data.name;
        }
      case 'entry_force_dt':
        if (value) return moment(value).format('DD.MM.YYYY');
      case 'receipt_recover_dt':
        if (value) return moment(value).format('DD.MM.YYYY');
      case 'fssp_date':
        if (value) return moment(value).format('DD.MM.YYYY');
      case 'r_court_id':
        if (value) {
          const data = await this.ModelLawCourt.findByPk(value as number);
          if (data) return data.name;
        }
      default:
        if (value) {
          if (typeof value === 'string') {
            if (value.length > 2000) {
              const arr = value.split('\n');
              let sum_length = 0;
              const split_arr = arr.reduce((prev, curr) => prev + `${curr}`);
              const over_length = split_arr.length;
              const total_minus_length = over_length + 100 - 2000;
              console.log('total_minus_length', total_minus_length);
              for (let i = 0; sum_length <= total_minus_length; i++) {
                const item = arr[i];
                sum_length += item.length;
                console.log(
                  sum_length <= total_minus_length
                    ? `Ещё не превышено ${sum_length} > ${total_minus_length}`
                    : `Превышено ${sum_length} > ${total_minus_length}`,
                );
              }
              const a = split_arr.slice(sum_length);
              console.log(a, a.length);
              return a;
            } else return value;
          }
        }
        return '';
    }
  }
}
@Module({
  imports: [SequelizeModule.forFeature([Dict, LawCourt], 'contact')],
  providers: [Helper],
  exports: [Helper],
})
export class HelperModule {}
