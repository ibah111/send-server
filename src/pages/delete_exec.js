import moment from "moment";
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
      if (le !== null) {
        le.state = 6;
        le.save();
        await le.createLawExecProtokol({
          r_user_id: OpUser.id,
          typ: 23,
          dsc: `Перевод в архив`,
        });
        return le.id;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
};
export const name = "delete_exec";
