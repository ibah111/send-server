import moment from "moment";
import { Sql } from "./sql";
export default (sql: Sql) => async (typ: string, value: any) => {
  switch (typ) {
    case "load_dt":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "state":
      if (value) {
        const data: any = await sql.contact.models.Dict.findOne({
          where: { parent_id: 77, code: value },
        });
        if (data) return data.name;
      }
    case "executive_typ":
      if (value) {
        const data: any = await sql.contact.models.Dict.findOne({
          where: { parent_id: 124, code: value },
        });
        if (data) return data.name;
      }
    case "court_date":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "DELIVERY_TYP":
      if (value) {
        const data: any = await sql.contact.models.Dict.findOne({
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
        const data: any = await sql.contact.models.LawCourt.findByPk(value);
        if (data) return data.name;
      }
    default:
      if (value) return value;
      return "";
  }
};
