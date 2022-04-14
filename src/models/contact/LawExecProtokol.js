import { DataTypes, Model } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "LawExecProtokol";
/**
 *
 * @param {@param {import("sequelize").Sequelize} sequelize} sequelize
 */
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parent_id: { type: DataTypes.INTEGER },
      r_user_id: { type: DataTypes.INTEGER },
      dt: { type: DataTypes.DATE },
      typ: { type: DataTypes.INTEGER },
      dsc: { type: DataTypes.STRING(2000) },
      r_doc_attach_id: { type: DataTypes.INTEGER },
      r_doc_link_id: { type: DataTypes.INTEGER },
      ACTION_DT: { type: DataTypes.DATE },
      REASON: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "LawExecProtokol",
      tableName: "law_exec_protokol",
      createdAt: "dt",
      updatedAt: false,
    }
  );
  return Model;
};
/**
 *
 * @param {import("sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {
  asoc(sequelize.models.LawExecProtokol, sequelize.models.User, "r_user_id");
  asoc(sequelize.models.LawExecProtokol, sequelize.models.LawExec, "parent_id");
};
