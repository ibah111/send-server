/**
 * @typedef {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} ModelK
 */
/**
 * @typedef {Object} Params
 * @property {Object} options.target
 * @property {string} options.target.key
 * @property {string} options.target.value
 * @property {string} options.nameKey
 */
/**
 * @param {ModelK} DBfrom
 * @param {ModelK} DBto
 * @param {Params} params
 */
export const polym = (DBfrom, DBto, params) => {
  const options = {
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
