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
    return await sql.contact.models.LawExec.findOne({
      where: { id: body.id },
      include: [
        { model: sql.contact.models.Person, attributes: ["f", "i", "o"] },
        { model: sql.contact.models.Debt, attributes: ["contract"] },
      ],
    });
  };
};
export const name = "law_exec";
