import { DataTypes, Model } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "LawActProtokol";
/**
 *
 * @param {@param {import("sequelize").Sequelize} sequelize} sequelize
 */
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      obj_id: { type: DataTypes.INTEGER },
      r_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.VARCHAR(255) },
      filename: { type: DataTypes.VARCHAR(255) },
      filebody: { type: DataTypes.BLOB },
      vers1: { type: DataTypes.INTEGER, defaultValue: 1 },
      vers2: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active: { type: DataTypes.INTEGER, defaultValue: 1 },
      attach_typ: { type: DataTypes.INTEGER },
      r_user_id: { type: DataTypes.INTEGER },
      dt: { type: DataTypes.DATE },
      number: { type: DataTypes.VARCHAR(32), defaultValue: "" },
      FILE_SERVER_NAME: { type: DataTypes.STRING(600) },
      REL_SERVER_PATH: { type: DataTypes.STRING(600) },
      ORIGIN_OBJ: { type: DataTypes.INTEGER },
      R_ORIGIN_ID: { type: DataTypes.INTEGER },
      CHANGE_DT: { type: DataTypes.DATE },
      DOC_SIZE: { type: DataTypes.INTEGER },
      SAVE_MODE: { type: DataTypes.INTEGER },
      EXTENSION: { type: DataTypes.STRING(50) },
      EXT_ID: { type: DataTypes.STRING(32) },
      FROM_DT: { type: DataTypes.DATE },
      TO_DT: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "DocAttach",
      tableName: "doc_attach",
      createdAt: "dt",
      hasTrigger: true,
      updatedAt: "CHANGE_DT",
    }
  );
  return Model;
};
/**
 *
 * @param {import("sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {
  asoc(sequelize.models.LawActProtokol, sequelize.models.User, "r_user_id");
};
