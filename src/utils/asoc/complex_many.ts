import { HasManyOptions } from "@contact/sequelize";
import { ModelK } from "./types";

export type ParamsComplexMany = {
  name: string;
  join: { key: string; value: string };
  where: { key: string; value: string };
};
export const complex_many = (
  DBfrom: ModelK,
  DBto: ModelK,
  params: ParamsComplexMany
) => {
  const options_has:HasManyOptions = {
    scope: { [params?.where?.key]: params?.where?.value },
    constraints: false,
    foreignKey: params?.join?.key,
    sourceKey: params?.join?.value,
    as: params?.name,
  };
  DBfrom.hasMany(DBto, options_has);
};
