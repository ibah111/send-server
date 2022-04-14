import { Op } from "@contact/sequelize";
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
    let where = {};
    if (body.id) where = { id: body.id };
    if (body.name) where = { name: { [Op.like]: `%${body.name}%` } };
    return await sql.contact.models.LawCourt.findAll({
      where: { typ: 2, ...where },
      attributes: ["id", "name", "address"],
      limit: 25,
    });
  };
};
export const name = "court";
