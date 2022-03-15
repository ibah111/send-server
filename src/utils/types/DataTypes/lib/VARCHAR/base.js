import ABSTRACT from "../../BASE";
export default () => {
  class VARCHAR extends ABSTRACT {
    /**
     * @param {number} [length=255] length of string
     * @param {boolean} [binary=false] Is this binary?
     */
    constructor(length, binary) {
      super();
      const options = (typeof length === "object" && length) || {
        length,
        binary,
      };
      this.options = options;
      this._binary = options.binary;
      this._length = options.length || 255;
    }
    toSql() {
      return joinSQLFragments([
        `VARCHAR(${this._length})`,
        this._binary && "BINARY",
      ]);
    }
    validate(value) {
      if (Object.prototype.toString.call(value) !== "[object String]") {
        if (
          (this.options.binary && Buffer.isBuffer(value)) ||
          typeof value === "number"
        ) {
          return true;
        }
        throw new sequelizeErrors.ValidationError(
          util.format("%j is not a valid string", value)
        );
      }
      return true;
    }

    get BINARY() {
      this._binary = true;
      this.options.binary = true;
      return this;
    }

    static get BINARY() {
      return new this().BINARY;
    }
  }
  VARCHAR.key = VARCHAR.prototype.key = "VARCHAR";
  return VARCHAR;
};
