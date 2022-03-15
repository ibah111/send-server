export default (PNUMERIC) => {
  class NUMERIC extends PNUMERIC {
    constructor(length) {
      super();
      const options = (typeof length === "object" && length) || {
        length,
      };
      this.options = options;
      this._length = options.length || 255;
    }
    // Mandatory, complete definition of the new type in the database
    toSql() {
      if (this._precision || this._scale) {
        return `NUMERIC(${[this._precision, this._scale]
          .filter(_.identity)
          .join(",")})`;
      }
      return "NUMERIC";
    }
  }
  NUMERIC.key = NUMERIC.prototype.key = "NUMERIC";
  NUMERIC.prototype.escape = false;
  return NUMERIC;
};
