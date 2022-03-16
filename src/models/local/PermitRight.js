import { DataTypes, Model } from "sequelize";
import { asoc } from "../../utils/asoc";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      right: {
        type: DataTypes.INTEGER,
      },
      group: {
        type: DataTypes.INTEGER,
      },
      user: { type: DataTypes.INTEGER },
      isUser: { type: DataTypes.BOOLEAN, defaultValue: false },
      type: {
        type: DataTypes.ENUM,
        values: ["actions"],
        allowNull: false,
      },
      isOwner: { type: DataTypes.BOOLEAN, defaultValue: false },
      target: { type: DataTypes.INTEGER, defaultValue: null },
    },
    { sequelize, modelName: "PermitRight", tableName: "permit_rights" }
  );
};
/**
 *
 * @param {import("sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {
  asoc(sequelize.models.PermitRight, sequelize.models.Right, "right");
  asoc(sequelize.models.PermitRight, sequelize.models.Group, "group");
  asoc(sequelize.models.PermitRight, sequelize.models.User, "user");
};
export const migrator = {};
