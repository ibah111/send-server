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
  const options = {
    scope: { [params?.where?.key]: params?.where?.value },
    targetKey: params?.join?.key,
    foreignKey: params?.join?.value,
  };
  DBto.hasMany(DBfrom, options);
  DBfrom.belongsTo(DBto, options);
};
