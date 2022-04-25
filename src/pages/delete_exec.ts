import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";

export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (req: FastifyRequest<{ Body: { id: number } }>, user: any) => {
    const body = req.body;
    const OpUser: any = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (OpUser !== null) {
      const le: any = await sql.contact.models.LawExec.findByPk(body.id);
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
