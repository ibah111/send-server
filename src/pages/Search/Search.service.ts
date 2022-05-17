import { Sequelize } from "@contact/sequelize-typescript";
import { Op } from "@contact/sequelize";
import dottie from "dottie";
import { InjectModel } from "@contact/nestjs-sequelize";
import {
  Person,
  Portfolio,
  Debt,
  LawExec,
  Dict,
  Address,
  LawAct,
} from "@contact/models";
import { Injectable } from "@nestjs/common";
@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Person) private ModelPerson: typeof Person,
    @InjectModel(Portfolio) private ModelPortfolio: typeof Portfolio,
    @InjectModel(Debt) private ModelDebt: typeof Debt,
    @InjectModel(LawExec) private ModelLawExec: typeof LawExec,
    @InjectModel(Dict) private ModelDict: typeof Dict,
    @InjectModel(Address) private ModelAddress: typeof Address,
    @InjectModel(LawAct) private ModelLawAct: typeof LawAct
  ) {}
  async search(body: any) {
    const result = await this.ModelLawExec.findAll({
      where: { state: { [Op.notIn]: [5] } },
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
          model: this.ModelDict,
          as: "StateDict",
          attributes: ["name"],
        },
        {
          model: this.ModelLawAct,
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
              model: this.ModelDict,
              as: "StatusDict",
              attributes: ["name"],
            },
            {
              model: this.ModelDict,
              as: "ActStatusDict",
              attributes: ["name"],
            },
          ],
          attributes: ["id", "typ"],
        },
        { model: this.ModelPortfolio, attributes: ["name"] },
        { model: this.ModelDict, as: "ExecutiveTyp", attributes: ["name"] },
        {
          model: this.ModelDebt,
          attributes: ["id", "contract", "debt_sum"],
          where: {
            status: { [Op.notIn]: [7] },
            ...(body.contract ? { contract: body.contract } : {}),
          },
          include: [
            {
              model: this.ModelDict,
              as: "StatusDict",
              attributes: ["name"],
            },
          ],
        },
        {
          model: this.ModelPerson,
          include: [
            {
              model: this.ModelAddress,
              as: "Addresses",
              attributes: ["full_adr"],
              limit: 1,
            },
          ],
          where: body.name
            ? Sequelize.where(
                Sequelize.fn(
                  "concat",
                  Sequelize.col("f"),
                  " ",
                  Sequelize.col("i"),
                  " ",
                  Sequelize.col("o")
                ),
                { [Op.like]: `%${body.name}%` }
              )
            : {},
          attributes: ["id", "f", "i", "o", [Sequelize.literal("''"), "fio"]],
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: LawExec) =>
      dottie.flatten(res)
    );
  }
}
