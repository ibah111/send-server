export default (PVARCHAR) => {
  class VARCHAR extends PVARCHAR {
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
      return `VARCHAR(${this._length})`;
    }
    _stringify(value, options) {
      return options.escape(value);
    }
    _bindParam(value, options) {
      return options.bindParam(value);
    }
  }
  VARCHAR.key = VARCHAR.prototype.key = "VARCHAR";
  VARCHAR.prototype.escape = false;
  return VARCHAR;
};
