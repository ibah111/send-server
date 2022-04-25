import { Op } from "@contact/sequelize";
import dottie from "dottie";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Sql } from "../utils/sql";
export const call = (fastify: FastifyInstance, sql: Sql) => {
  return async (
    req: FastifyRequest<{
      Body: { id: number; name: string; contract: string };
    }>,
    user: any
  ) => {
    const body = req.body;
    const result = await sql.contact.models.LawAct.findAll({
      attributes: ["id", "typ"],
      where: {
        [Op.or]: [
          { status: { [Op.notIn]: [10] }, typ: { [Op.in]: [1] } },
          { act_status: { [Op.notIn]: [15] }, typ: { [Op.in]: [0, 2, 3, 4] } },
        ],
      },
      include: [
        {
          model: sql.contact.models.Dict,
          as: "Status",
          attributes: ["name"],
        },
        {
          model: sql.contact.models.Address,
          as: "Address",
          attributes: ["full_adr"],
          limit: 1,
        },
        { model: sql.contact.models.Address, as: "Address" },
        {
          model: sql.contact.models.Dict,
          as: "ActStatus",
          attributes: ["name"],
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
        { model: sql.contact.models.Portfolio, attributes: ["name"] },
        {
          model: sql.contact.models.Debt,
          attributes: ["id", "contract", "debt_sum"],
          where: {
            status: { [Op.notIn]: [7] },
            ...(body.contract ? { contract: body.contract } : {}),
          },
          include: {
            //@ts-ignore
            model: sql.contact.models.Dict,
            as: "Status",
            attributes: ["name"],
          },
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: any) =>
      dottie.flatten(res)
    );
  };
};
export const name = "search_la";
