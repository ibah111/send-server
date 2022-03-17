/**
 * @typedef {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} ModelK
 */
/**
 * @typedef {Object} Params
 * @property {Object} options.join
 * @property {string} options.join.key
 * @property {string} options.join.value
 * @property {Object} options.where
 * @property {string} options.where.key
 * @property {string} options.where.value
 */
/**
 * @param {ModelK} DBfrom
 * @param {ModelK} DBto
 * @param {Params} params
 */
export const complex = (DBfrom, DBto, params) => {
  const options_has = {
    scope: { [params?.where?.key]: params?.where?.value },
    constraints: false,
    foreignKey: params?.join?.key,
    sourceKey: params?.join?.value,
    as: params?.name,
  };
  DBfrom.hasOne(DBto, options_has);
};
