export default (PMONEY) => {
  class MONEY extends PMONEY {
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
      return "MONEY";
    }
  }
  MONEY.key = MONEY.prototype.key = "MONEY";
  MONEY.prototype.escape = false;
  return MONEY;
};
