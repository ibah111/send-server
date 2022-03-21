import moment from "moment";
const data = [
  "total_sum",
  "load_dt",
  "court_doc_num",
  "executive_typ",
  "court_date",
  "DELIVERY_TYP",
  "entry_force_dt",
  "receipt_recover_dt",
  "fssp_date",
  "r_court_id",
  "dsc",
];
const translate = {
  total_sum: "Общая сумма",
  load_dt: "Дата создания ИП",
  court_doc_num: "№ исп. документа",
  executive_typ: "Тип исп. документа",
  court_date: "Дата вынесения",
  DELIVERY_TYP: "Способ подачи",
  entry_force_dt: "Дата вступления в силу",
  receipt_recover_dt: "Дата получения ИЛ на взыскание",
  fssp_date: "Дата подачи",
  r_court_id: "ФССП",
  dsc: "Коментарий",
};
const t = (value) => {
  if (translate[value]) return translate[value];
  return "Не определено";
};
const g = (value) => {
  switch (value) {
    case "":
      return null;
    case 0:
      return null;
    default:
      return value;
  }
};
/**
 * @typedef {Object} Sql
 * @property {import("sequelize").Sequelize} Sql.local
 * @property {import("sequelize").Sequelize} Sql.contact
 */
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Sql} sql
 */
export const call = (fastify, sql) => {
  const h = async (typ, value) => {
    switch (typ) {
      case "load_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
        return value;
      case "executive_typ":
        if (value)
          return (
            await sql.contact.models.Dict.findOne({
              where: { parent_id: 124, code: value },
            })
          ).name;
        return value;
      case "court_date":
        if (value) return moment(value).format("DD.MM.YYYY");
        return value;
      case "DELIVERY_TYP":
        if (value)
          return (
            await sql.contact.models.Dict.findOne({
              where: { parent_id: 16, code: value },
            })
          ).name;
        return value;
      case "entry_force_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
        return value;
      case "receipt_recover_dt":
        if (value) return moment(value).format("DD.MM.YYYY");
        return value;
      case "fssp_date":
        if (value) return moment(value).format("DD.MM.YYYY");
        return value;
      case "r_court_id":
        if (value)
          return (await sql.contact.models.LawCourt.findByPk(value)).name;
        return value;
      default:
        return value;
    }
  };
  /**
   *
   * @param {import("fastify").FastifyRequest} req
   * @param {import("fastify").FastifyReply} res
   */
  return async (req, user) => {
    const body = req.body;
    const OpUser = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (OpUser !== null) {
      const le = await sql.contact.models.LawExec.findByPk(body.id);
      for (const value of data) {
        le[value] = g(body[value]);
      }
      const changes = le.changed();
      if (changes) {
        for (const change of changes) {
          await le.createLawExecProtokol({
            r_user_id: OpUser.id,
            typ: 2,
            dsc: `${t(change)}. Старое значение: ${await h(
              change,
              le.previous(change)
            )}. Новое значение: ${await h(change, le[change])}.`,
          });
        }
        await le.save();
      }
      return true;
    } else {
      return false;
    }
  };
};
export const name = "update_exec";
