//export {default as BASE} from "./BASE";
import { default as MONEY } from "./MONEY";
import { default as NUMERIC } from "./NUMERIC";
import { default as VARCHAR } from "./VARCHAR";
/**
 * @param {import("Sequelize")} Sequelize
 */
export default function Types(Sequelize) {
  MONEY(Sequelize);
  NUMERIC(Sequelize);
  VARCHAR(Sequelize);
  Sequelize.DataTypes.mssql.DATE.prototype._stringify = function _stringify(date, options) {
    return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
  };
}
