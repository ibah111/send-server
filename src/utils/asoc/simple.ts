import { HasManyOptions } from "@contact/sequelize";
import { ModelK } from "./types";

export const simple = (DBfrom: ModelK, DBto: ModelK, key: string) => {
  const options: HasManyOptions = { foreignKey: key };
  DBto.hasMany(DBfrom, options);
  DBfrom.belongsTo(DBto, options);
};
