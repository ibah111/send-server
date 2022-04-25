import { Op } from "@contact/sequelize";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";

export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (
    req: FastifyRequest<{ Body: { id: number; name: string } }>,
    user: any
  ) => {
    const body = req.body;
    let where = {};
    if (body.id) where = { id: body.id };
    if (body.name)
      where = {
        name: { [Op.like]: `%${body.name}%` },
        id: { [Op.gte]: 74643 },
      };
    return await sql.contact.models.LawCourt.findAll({
      where: { typ: 2, ...where },
      attributes: ["id", "name", "address"],
      limit: 25,
    });
  };
};
export const name = "court";
