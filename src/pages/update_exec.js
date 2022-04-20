import moment from "moment";
import download from "../utils/download";
import help from "../utils/help";
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
];
const translate = {
  state: "Статус",
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
/**
 * @typedef {Object} Sql
 * @property {import("@contact/sequelize").Sequelize} Sql.local
 * @property {import("@contact/sequelize").Sequelize} Sql.contact
 */
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Sql} sql
 */
export const call = (fastify, sql) => {
  const downloadFile = download(sql);
  const h = help(sql);
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
        le[value] = body[value];
      }
      const changes = le.changed();
      if (changes) {
        le.state = 9;
        const new_dsc = `${moment().format("DD.MM.YYYY")} Сопровод к ИД ${
          le.court_doc_num
        } ${await h("executive_typ", le.executive_typ)} ${moment(
          le.court_date
        ).format("DD.MM.YYYY")}`;
        if (le.dsc === 'Создается ИП из "Отправка"') {
          le.dsc = new_dsc;
        } else {
          if (!le.dsc) {
            le.dsc = "";
          } else {
            le.dsc += "\r\n";
          }
          le.dsc += new_dsc;
        }
        const la = await le.getLawAct();
        if (la !== null) {
          if (la.typ !== 1) {
            la.act_status = 13;
          } else {
            la.status = 9;
          }
          await la.save();
          await la.createLawActProtokol({
            r_user_id: OpUser.id,
            typ: 36,
            dsc: `Перевод исполнительного документа на исполнительное производство. ID исп. док-та = ${le.id}`,
          });
        }
        const changes = le.changed();

        const doc_name = `Сопровод к ИД ${le.court_doc_num
          .replaceAll("\\", "-")
          .replaceAll("/", "-")} ${await h(
          "executive_typ",
          le.executive_typ
        )} ${moment(le.court_date).format("DD.MM.YYYY")}.pdf`;
        for (const change of changes) {
          switch (change) {
            case "r_court_id":
              await le.createLawExecProtokol({
                r_user_id: OpUser.id,
                typ: 62,
                dsc: `${t(change)}. Новое значение: "${await h(
                  change,
                  le[change]
                )}". Старое значение: "${await h(
                  change,
                  le.previous(change)
                )}".`,
              });
              break;
            case "state":
              switch (le.previous(change)) {
                case 13:
                  await le.createLawExecProtokol({
                    r_user_id: OpUser.id,
                    typ: 30,
                    dsc: `Перевод исполнительного документа на исполнительное производство`,
                  });
                  break;
                default:
                  await le.createLawExecProtokol({
                    r_user_id: OpUser.id,
                    typ: 2,
                    dsc: `${t(change)}. Новое значение: "${await h(
                      change,
                      le[change]
                    )}". Старое значение: "${await h(
                      change,
                      le.previous(change)
                    )}".`,
                  });
                  break;
              }
              break;
            default:
              await le.createLawExecProtokol({
                r_user_id: OpUser.id,
                typ: 2,
                dsc: `${t(change)}. Новое значение: "${await h(
                  change,
                  le[change]
                )}". Старое значение: "${await h(
                  change,
                  le.previous(change)
                )}".`,
              });
              break;
          }
        }
        await le.save();
        const data = await downloadFile(
          OpUser,
          le,
          doc_name,
          data.template_typ
        );
        const doc = await sql.contact.models.DocAttach.create(data.sql);
        await le.createLawExecProtokol({
          r_user_id: OpUser.id,
          typ: 8,
          r_doc_attach_id: doc.id,
          dsc: `Вложение: ${doc.name}`,
        });
        return { file: data.file.data, name: data.sql.name };
      }
    } else {
      return false;
    }
  };
};
export const name = "update_exec";
