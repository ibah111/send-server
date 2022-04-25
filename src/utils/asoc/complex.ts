import { HasOneOptions } from "@contact/sequelize";
import { ModelK } from "./types";

export type ParamsComplex = {
  name: string;
  join: { key: string; value: string };
  where: { key: string; value: string };
};
export const complex = (
  DBfrom: ModelK,
  DBto: ModelK,
  params: ParamsComplex
) => {
  const options_has:HasOneOptions = {
    scope: { [params?.where?.key]: params?.where?.value },
    constraints: false,
    foreignKey: params?.join?.key,
    sourceKey: params?.join?.value,
    as: params?.name,
  };
  DBfrom.hasOne(DBto, options_has);
};
