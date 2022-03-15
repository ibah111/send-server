import _ from "lodash";
import base from "./number";
export default () => {
  const NUMBER = base();
  class NUMERIC extends NUMBER {
    /**
     * @param {string|number} [precision] defines precision
     * @param {string|number} [scale] defines scale
     */
    constructor(precision, scale) {
      super(
        (typeof precision === "object" && precision) || { precision, scale }
      );
    }
    toSql() {
      if (this._precision || this._scale) {
        return `DECIMAL(${[this._precision, this._scale]
          .filter(_.identity)
          .join(",")})`;
      }
      return "DECIMAL";
    }
    validate(value) {
      if (!Validator.isDecimal(String(value))) {
        throw new sequelizeErrors.ValidationError(
          util.format("%j is not a valid decimal", value)
        );
      }
      return true;
    }
  }
  return NUMERIC;
};
