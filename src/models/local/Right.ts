import { DataTypes, Model, Sequelize } from "@contact/sequelize";
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
      title: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    { sequelize, modelName: "Right", tableName: "rights" }
  );
};
export const join = (sequelize: Sequelize) => {};
export const migrator = {
  name: "Right",
  migrate: async (sequelize: Sequelize) => {
    const data = [
      { title: "Чтение", name: "view" },
      { title: "Изменение", name: "edit" },
      { title: "Удаление", name: "delete" },
    ];
    if ((await sequelize.models.Right.count()) === 0) {
      for (const value of data) {
        const instance = sequelize.models.Right.build(value);
        await instance.save();
      }
    }
  },
};
