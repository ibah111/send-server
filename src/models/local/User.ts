import { DataTypes, Model, Sequelize } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const model = (sequelize: Sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      bitrix_id: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      f: {
        type: DataTypes.STRING,
      },
      i: {
        type: DataTypes.STRING,
      },
      o: {
        type: DataTypes.STRING,
      },
      group: { type: DataTypes.INTEGER },
      position: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, modelName: "User", tableName: "users" }
  );
};
export const join = (sequelize: Sequelize) => {
  asoc(sequelize.models.User, sequelize.models.Group, "group");
};
export const migrator = {
  name: "User",
  migrate: async (sequelize: Sequelize) => {},
  demo: async (sequelize: Sequelize) => {
    const data = [
      { bitrix_id: 1, f: "Тестер 1", group: 1 },
      { bitrix_id: 2, f: "Тестер 2", group: 2 },
      { bitrix_id: 3, f: "Тестер 3", group: 2 },
      { bitrix_id: 4, f: "Тестер 4", group: 3 },
      { bitrix_id: 5, f: "Тестер 5", group: 3 },
      { bitrix_id: 6, f: "Тестер 6", group: 3 },
    ];
    if ((await sequelize.models.User.count()) === 0) {
      for (const value of data) {
        const instance = sequelize.models.User.build(value);
        await instance.save();
      }
    }
  },
};
