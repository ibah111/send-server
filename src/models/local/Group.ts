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
    { sequelize, modelName: "Group", tableName: "groups" }
  );
};
export const join = (sequelize: Sequelize) => {};

export const migrator = {
  name: "Group",
  migrate: async (sequelize: Sequelize) => {
    const data = [
      { title: "Администратор", name: "admin" },
      { title: "Модератор", name: "moderator" },
      { title: "Сотрудник", name: "worker" },
      { title: "Смотритель", name: "viewer" },
    ];
    if ((await sequelize.models.Group.count()) === 0) {
      for (const value of data) {
        const instance = sequelize.models.Group.build(value);
        await instance.save();
      }
    }
  },
};
