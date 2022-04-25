import { DataTypes, Model, Sequelize } from "@contact/sequelize";
export const name = "Dict";
export const model = (sequelize:Sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parent_id: { type: DataTypes.INTEGER },
      code: { type: DataTypes.INTEGER },
      name: { type: DataTypes.VARCHAR(256) },
      r_code: { type: DataTypes.INTEGER },
      typ: { type: DataTypes.INTEGER },
      change_dt: { type: DataTypes.DATE },
      is_close: { type: DataTypes.INTEGER },
      KIND: { type: DataTypes.INTEGER },
      LANG: { type: DataTypes.INTEGER },
      lang_canonical: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Dict",
      tableName: "dict",
      createdAt: false,
      updatedAt: "change_dt",
    }
  );
  return model;
};
