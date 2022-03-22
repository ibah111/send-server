import moment from "moment";
/**
 * @typedef {Object} Sql
 * @property {import("sequelize").Sequelize} Sql.local
 * @property {import("sequelize").Sequelize} Sql.contact
 */
/**
 * @param {Sql} sql
 */
export default (sql) => async (typ, value) => {
  switch (typ) {
    case "load_dt":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "state":
      if (value)
        return (
          await sql.contact.models.Dict.findOne({
            where: { parent_id: 77, code: value },
          })
        ).name;
    case "executive_typ":
      if (value)
        return (
          await sql.contact.models.Dict.findOne({
            where: { parent_id: 124, code: value },
          })
        ).name;
    case "court_date":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "DELIVERY_TYP":
      if (value)
        return (
          await sql.contact.models.Dict.findOne({
            where: { parent_id: 16, code: value },
          })
        ).name;
    case "entry_force_dt":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "receipt_recover_dt":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "fssp_date":
      if (value) return moment(value).format("DD.MM.YYYY");
    case "r_court_id":
      if (value)
        return (await sql.contact.models.LawCourt.findByPk(value)).name;
    default:
      if (value) return value;
      return "";
  }
};
