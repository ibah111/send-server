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
   * @param {import("fastify").FastifyReply} res
   */
  return async (req, res) => {
    const body = req.body;
    switch (body.type) {
      case "law_act":
        return await sql.contact.models.LawAct.findOne({
          where: { id: body.id },
          attributes: ["dsc"],
        });
      case "law_exec":
        return await sql.contact.models.LawExec.findOne({
          where: { id: body.id },
          include: { model: sql.contact.models.LawAct, attributes: ["dsc"] },
          attributes: ["dsc"],
        });
    }
  };
};
export const name = "get_comment";
