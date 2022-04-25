import { HasManyOptions } from "@contact/Sequelize";
import { ModelK } from "./types";

export const simple = (DBfrom: ModelK, DBto: ModelK, key: string) => {
  const options: HasManyOptions = { foreignKey: key };
  DBto.hasMany(DBfrom, options);
  DBfrom.belongsTo(DBto, options);
};
