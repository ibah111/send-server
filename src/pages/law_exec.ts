import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";

export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (req: FastifyRequest<{ Body: { id: number } }>, user: any) => {
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
