/**
 *
 * @typedef {Object} Data
 * @property {number} Data.id
 * @property {string} Data.value
 * @property {boolean} Data.law_act
 * @property {boolean} Data.law_exec
 */

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
  /**
   *
   * @param {import("fastify").FastifyRequest<{Body: Data}>} req
   */
  return async (req, user) => {
    const body = req.body;
    const OpUser = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (body.id && body.value) {
      const le = await sql.contact.models.LawExec.findByPk(body.id);
      if (body.law_exec) {
        if (!le.dsc) {
          le.dsc = "";
        } else {
          le.dsc += "\r\n";
        }
        le.dsc += body.value;
        await le.createLawExecProtokol({
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Новое значение: "${
            le.dsc
          }". Старое значение: "${le.previous("dsc")}".`,
        });
        await le.save();
      }
      if (body.law_act && le.r_act_id) {
        const la = await sql.contact.models.LawExec.findByPk(le.r_act_id);
        if (!la.dsc) {
          la.dsc = "";
        } else {
          la.dsc += "\r\n";
        }
        la.dsc += body.value;
        await la.createLawActProtokol({
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Новое значение: "${
            la.dsc
          }". Старое значение: "${la.previous("dsc")}".`,
        });
        await la.save();
      }
      return true;
    } else {
      return false;
    }
  };
};
export const name = "add_comment";
