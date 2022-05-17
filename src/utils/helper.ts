import { Dict, LawCourt } from "@contact/models";
import { InjectModel, SequelizeModule } from "@contact/nestjs-sequelize";
import { Injectable, Module } from "@nestjs/common";
import moment from "moment";
@Injectable()
export class Helper {
  constructor(
    @InjectModel(Dict) private ModelDict: typeof Dict,
    @InjectModel(LawCourt) private ModelLawCourt: typeof LawCourt
  ) {}
  async help(typ: string, value: any) {
    switch (typ) {
      case "load_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
      case "state":
        if (value) {
          const data: any = await this.ModelDict.findOne({
            where: { parent_id: 77, code: value },
          });
          if (data) return data.name;
        }
      case "executive_typ":
        if (value) {
          const data: any = await this.ModelDict.findOne({
            where: { parent_id: 124, code: value },
          });
          if (data) return data.name;
        }
      case "court_date":
        if (value) return moment(value).format("DD.MM.YYYY");
      case "DELIVERY_TYP":
        if (value) {
          const data: any = await this.ModelDict.findOne({
            where: { parent_id: 16, code: value },
          });
          if (data) return data.name;
        }
      case "entry_force_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
      case "receipt_recover_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
      case "fssp_date":
        if (value) return moment(value).format("DD.MM.YYYY");
      case "r_court_id":
        if (value) {
          const data: any = await this.ModelLawCourt.findByPk(value);
          if (data) return data.name;
        }
      default:
        if (value) return value;
        return "";
    }
  }
}
@Module({
  imports: [SequelizeModule.forFeature([Dict, LawCourt])],
  providers: [Helper],
  exports: [Helper],
})
export class HelperModule {}
