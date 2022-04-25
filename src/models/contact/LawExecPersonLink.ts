import { DataTypes, Model, Sequelize } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "LawExecPersonLink";
export const model = (sequelize: Sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      R_LAW_EXEC_ID: { type: DataTypes.INTEGER },
      LINK_TYPE: { type: DataTypes.INTEGER, defaultValue: 1 },
      PERSON_ROLE: { type: DataTypes.INTEGER, defaultValue: 1 },
      PERSON_ID: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "LawExecPersonLink",
      tableName: "law_exec_person_link",
      createdAt: false,
      updatedAt: false,
    }
  );
  return Model;
};
export const join = (sequelize: Sequelize) => {
  asoc(
    sequelize.models.LawExecPersonLink,
    sequelize.models.Person,
    "PERSON_ID"
  );
  asoc(
    sequelize.models.LawExecPersonLink,
    sequelize.models.LawExec,
    "R_LAW_EXEC_ID"
  );
};
