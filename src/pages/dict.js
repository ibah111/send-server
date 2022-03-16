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
  return async (req, res) => {
    const body = req.body;
    return await sql.contact.models.Dict.findAll({ where: { parent_id: body.id } });
  };
};
export const name = "dict";
