import base from "./number";
export default () => {
  const NUMBER = base();
  class MONEY extends NUMBER {
    toSql() {
      return "DECIMAL(19,4)";
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
  MONEY.key = MONEY.prototype.key = "MONEY";
  return MONEY;
};
