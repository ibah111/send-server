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
   * @param {import("fastify").FastifyRequest} req
   */
  return async (req, user) => {
    const body = req.body;
    const OpUser = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (body.id && body.value) {
      const le = await sql.contact.models.LawExec.findByPk(body.id);
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
      return true;
    } else {
      return false;
    }
  };
};
export const name = "add_comment";
