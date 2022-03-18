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
      const work_task = await debt.getWorkTask();
      if (work_task !== null)
        if (work_task.r_user_id !== null) user_id = work_task.r_user_id;
      if (la !== null) {
        const le = await la.createLawExec({
          state: 5,
          r_user_id: user_id,
          DELIVERY_TYP: 3,
          contract: debt.contract,
          currency: 1,
          dsc: 'Создается ИП из "Отправка"',
        });
        await le.createProtokol({
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
