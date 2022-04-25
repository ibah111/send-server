import { HasManyOptions } from "@contact/sequelize/types";
import { ModelK } from "./types";
export type ParamsPolym = {
  nameKey: string;
  target: { key: string; value: string };
};
export const polym = (DBfrom: ModelK, DBto: ModelK, params: ParamsPolym) => {
  const options: HasManyOptions = {
    scope: { [params?.target?.key]: params?.target?.value },
    constraints: false,
    foreignKey: params?.nameKey,
  };
  DBto.hasMany(DBfrom, options);
  DBfrom.belongsTo(DBto, {
    foreignKey: options.foreignKey,
    constraints: options.constraints,
  });
};
