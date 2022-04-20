import { Op } from "@contact/sequelize";
import dottie from "dottie";
/**
 * @typedef {Object} Sql
 * @property {import("@contact/sequelize").Sequelize} Sql.local
 * @property {import("@contact/sequelize").Sequelize} Sql.contact
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
    const result = await sql.contact.models.LawExec.findAll({
      where: { state: { [Op.in]: [13, 7] } },
      attributes: [
        "id",
        "court_doc_num",
        "executive_typ",
        "fssp_doc_num",
        "court_date",
        "entry_force_dt",
      ],
      include: [
        {
          model: sql.contact.models.Dict,
          as: "Typ",
          attributes: ["name"],
        },
        {
          model: sql.contact.models.Dict,
          as: "State",
          attributes: ["name"],
        },
        {
          model: sql.contact.models.Address,
          as: "Address",
          attributes: ["full_adr"],
          limit: 1,
        },
        {
          model: sql.contact.models.LawAct,
          where: {
            [Op.or]: [
              { status: { [Op.notIn]: [10] }, typ: { [Op.in]: [1] } },
              {
                act_status: { [Op.notIn]: [15] },
                typ: { [Op.in]: [0, 2, 3, 4] },
              },
            ],
          },
          include: [
            {
              model: sql.contact.models.Dict,
              as: "Status",
              attributes: ["name"],
            },
            {
              model: sql.contact.models.Dict,
              as: "ActStatus",
              attributes: ["name"],
            },
          ],
          attributes: ["id", "typ"],
        },
        { model: sql.contact.models.Portfolio, attributes: ["name"] },
        {
          model: sql.contact.models.Debt,
          attributes: ["id", "contract", "debt_sum"],
          where: {
            status: { [Op.notIn]: [7] },
            ...(body.contract ? { contract: body.contract } : {}),
          },
          include: {
            model: sql.contact.models.Dict,
            as: "Status",
            attributes: ["name"],
          },
        },
        {
          model: sql.contact.models.Person,
          where: body.name
            ? sql.contact.where(
                sql.contact.fn(
                  "concat",
                  sql.contact.col("f"),
                  " ",
                  sql.contact.col("i"),
                  " ",
                  sql.contact.col("o")
                ),
                { [Op.like]: `%${body.name}%` }
              )
            : {},
          attributes: [
            "id",
            [
              sql.contact.fn(
                "concat",
                sql.contact.col("f"),
                " ",
                sql.contact.col("i"),
                " ",
                sql.contact.col("o")
              ),
              "fio",
            ],
          ],
        },
      ],
      limit: 25,
    });
    return (JSON.parse(JSON.stringify(result))).map((res) => dottie.flatten(res));
  };
};
export const name = "search";
