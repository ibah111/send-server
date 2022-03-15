import base from "./lib/MONEY/base";
import MONEY from "./lib/MONEY/mssql";
export default (Sequelize) => {
  const PMONEY = base();
  const { DataTypes, Utils } = Sequelize;
  DataTypes.MONEY = Utils.classToInvokable(PMONEY);
  DataTypes.mssql.MONEY = Utils.classToInvokable(
    MONEY(PMONEY)
  );
};
