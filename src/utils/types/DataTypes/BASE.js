class ABSTRACT {
  toString(options) {
    return this.toSql(options);
  }
  toSql() {
    return this.key;
  }
  stringify(value, options) {
    if (this._stringify) {
      return this._stringify(value, options);
    }
    return value;
  }
  bindParam(value, options) {
    if (this._bindParam) {
      return this._bindParam(value, options);
    }
    return options.bindParam(this.stringify(value, options));
  }
  static toString() {
    return this.name;
  }
  static warn(link, text) {
    if (!warnings[text]) {
      warnings[text] = true;
      logger.warn(`${text} \n>> Check: ${link}`);
    }
  }
  static extend(oldType) {
    return new this(oldType.options);
  }
}

ABSTRACT.prototype.dialectTypes = "";
export default ABSTRACT;
