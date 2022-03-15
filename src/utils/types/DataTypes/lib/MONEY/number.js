import ABSTRACT from "../../BASE";
export default () => {
  class NUMBER extends ABSTRACT {
    /**
     * @param {object} options type options
     * @param {string|number} [options.length] length of type, like `INT(4)`
     * @param {boolean} [options.zerofill] Is zero filled?
     * @param {boolean} [options.unsigned] Is unsigned?
     * @param {string|number} [options.decimals] number of decimal points, used with length `FLOAT(5, 4)`
     * @param {string|number} [options.precision] defines precision for decimal type
     * @param {string|number} [options.scale] defines scale for decimal type
     */
    constructor(options = {}) {
      super();
      if (typeof options === "number") {
        options = {
          length: options,
        };
      }
      this.options = options;
      this._length = options.length;
      this._zerofill = options.zerofill;
      this._decimals = options.decimals;
      this._precision = options.precision;
      this._scale = options.scale;
      this._unsigned = options.unsigned;
    }
    toSql() {
      let result = this.key;
      if (this._length) {
        result += `(${this._length}`;
        if (typeof this._decimals === "number") {
          result += `,${this._decimals}`;
        }
        result += ")";
      }
      if (this._unsigned) {
        result += " UNSIGNED";
      }
      if (this._zerofill) {
        result += " ZEROFILL";
      }
      return result;
    }
    validate(value) {
      if (!Validator.isFloat(String(value))) {
        throw new sequelizeErrors.ValidationError(
          util.format(`%j is not a valid ${this.key.toLowerCase()}`, value)
        );
      }
      return true;
    }
    _stringify(number) {
      if (
        typeof number === "number" ||
        typeof number === "boolean" ||
        number === null ||
        number === undefined
      ) {
        return number;
      }
      if (typeof number.toString === "function") {
        return number.toString();
      }
      return number;
    }

    get UNSIGNED() {
      this._unsigned = true;
      this.options.unsigned = true;
      return this;
    }

    get ZEROFILL() {
      this._zerofill = true;
      this.options.zerofill = true;
      return this;
    }

    static get UNSIGNED() {
      return new this().UNSIGNED;
    }

    static get ZEROFILL() {
      return new this().ZEROFILL;
    }
  }
  NUMBER.key = NUMBER.prototype.key = "NUMBER";
  return NUMBER;
};
