import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";

export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (
    req: FastifyRequest<{ Body: { id: number; type: string } }>,
    user: any
  ) => {
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
