import moment from "moment";
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
  return async (req, user) => {
    const body = req.body;
    const OpUser = await sql.contact.models.User.findOne({
      where: { email: user.loged.login },
    });
    if (OpUser !== null) {
      const la = await sql.contact.models.LawAct.findByPk(body.id);
      const debt = await la.getDebt();
      let user_id = 17;
      const work_task = await debt.getWorkTasks();
      if (work_task.length > 0)
        if (work_task[0].r_user_id !== null) user_id = work_task[0].r_user_id;
      if (la !== null) {
        const le = await la.createLawExec({
          r_person_id: la.r_person_id,
          r_debt_id: la.r_debt_id,
          r_portfolio_id: la.r_portfolio_id,
          state: 5,
          r_user_id: user_id,
          DELIVERY_TYP: 3,
          contract: debt.contract,
          currency: 1,
          ...body.old,
          dsc: 'Создается ИП из "Отправка"',
        });
        await le.createLawExecPersonLink({ PERSON_ID: la.r_person_id });
        await le.createLawExecProtokol({
          r_user_id: OpUser.id,
          typ: 1,
          dsc: `Создание ИД из "Отправки" со значениями: Статус - (5) Аннулировано, Тип доставки - (3) Курьером, Договор - ${debt.contract}`,
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
export const name = "create_exec";
