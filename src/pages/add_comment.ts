import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";
type Data = { id: number; value: string; law_act: boolean; law_exec: boolean };
export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (req: FastifyRequest<{ Body: Data }>, user: any) => {
    const body = req.body;
    const OpUser: any = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (body.id && body.value) {
      const le: any = await sql.contact.models.LawExec.findByPk(body.id);
      if (body.law_exec) {
        if (!le.dsc) {
          le.dsc = "";
        } else {
          le.dsc += "\r\n";
        }
        le.dsc += body.value;
        await le.createLawExecProtokol({
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Добавлена строка: "${body.value}".`,
        });
        await le.save();
      }
      if (body.law_act && le.r_act_id) {
        const la: any = await sql.contact.models.LawAct.findByPk(le.r_act_id);
        if (!la.dsc) {
          la.dsc = "";
        } else {
          la.dsc += "\r\n";
        }
        la.dsc += body.value;
        await la.createLawActProtokol({
          r_user_id: OpUser.id,
          typ: 2,
          dsc: `Комментарий. Добавлена строка: "${body.value}".`,
        });
        await la.save();
      }
      return true;
    } else {
      return false;
    }
  };
};
export const name = "add_comment";
