import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";

export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (req: FastifyRequest<{ Body: { id: number } }>, user: any) => {
    const body = req.body;
    return "Ok";
  };
};
export const name = "login";
