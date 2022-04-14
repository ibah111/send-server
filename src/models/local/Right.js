import { DataTypes, Model } from "@contact/sequelize";
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
/**
 *
 * @param {import("sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {};
export const migrator = {
  name: "Right",
  /**
   *
   * @param {import("sequelize").Sequelize} sequelize
   */
  migrate: async (sequelize) => {
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
