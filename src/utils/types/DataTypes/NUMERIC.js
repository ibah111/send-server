import base from "./lib/NUMERIC/base";
import NUMERIC from "./lib/NUMERIC/mssql";
export default (Sequelize) => {
  const { DataTypes, Utils } = Sequelize;
  const PNUMERIC = base();
  DataTypes.NUMERIC = Utils.classToInvokable(PNUMERIC);
  DataTypes.mssql.NUMERIC = Utils.classToInvokable(
    NUMERIC(PNUMERIC)
  );
};
