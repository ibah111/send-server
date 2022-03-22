import { DataTypes, Model } from "sequelize";
export const name = "ConstValue";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.VARCHAR(64) },
      dsc: { type: DataTypes.VARCHAR(512) },
      typ: { type: DataTypes.INTEGER },
      value: { type: DataTypes.VARCHAR(2000) },
      change_dt: { type: DataTypes.DATE },
      kind: { type: DataTypes.INTEGER },
      DSC2: { type: DataTypes.STRING(512) },
      VALUE_DEFAULT: { type: DataTypes.STRING(256) },
    },
    {
      sequelize,
      modelName: "ConstValue",
      tableName: "const_value",
      createdAt: false,
      updatedAt: "change_dt",
    }
  );
  return model;
};
