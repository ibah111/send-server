/**
 * @typedef {import("@contact/sequelize").ModelCtor<import("@contact/sequelize").Model<any, any>>} ModelK
 */
/**
 * @param {ModelK} DBfrom
 * @param {ModelK} DBto
 * @param {string} key
 */
export const simple = (DBfrom, DBto, key) => {
  const options = { foreignKey: key };
  DBto.hasMany(DBfrom, options);
  DBfrom.belongsTo(DBto, options);
};
