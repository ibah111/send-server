import base from "./lib/VARCHAR/base";
import VARCHAR from "./lib/VARCHAR/mssql";
export default (Sequelize) => {
  const { DataTypes, Utils } = Sequelize;

  const PVARCHAR = base();
  DataTypes.VARCHAR = Utils.classToInvokable(PVARCHAR);
  DataTypes.mssql.VARCHAR = Utils.classToInvokable(
    VARCHAR(PVARCHAR)
  );
};
