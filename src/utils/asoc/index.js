import { simple } from "./simple";
import { complex } from "./complex";
import { polym } from "./polym";
/**
 * @typedef {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} ModelK
 */
/**
 * @param {ModelK} DBfrom
 * @param {ModelK} DBto
 * @param {String|import("./complex").Params | import("./polym").Params} key
 * @param {string} type
 */
export const asoc = (DBfrom, DBto, key, type = "simple") => {
  switch (type) {
    case "simple":
      return simple(DBfrom, DBto, key);
    case "complex":
      return complex(DBfrom, DBto, key);
    case "polym":
      return polym(DBfrom, DBto, key);
    default:
      return simple(DBfrom, DBto, key);
  }
};
