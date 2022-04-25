import { DataTypes, Model } from "@contact/sequelize";
export const name = "Portfolio";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parent_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.VARCHAR(64) },
      sign_date: { type: DataTypes.DATE },
      end_date: { type: DataTypes.DATE },
      success_coeff: { type: DataTypes.REAL },
      group_index: { type: DataTypes.INTEGER },
      r_formula_id: { type: DataTypes.INTEGER },
      dsc: { type: DataTypes.VARCHAR(128) },
      contract_info: { type: DataTypes.VARCHAR(32) },
      id$: { type: DataTypes.INTEGER },
      r_package_id: { type: DataTypes.INTEGER },
      status: { type: DataTypes.INTEGER },
      code: { type: DataTypes.INTEGER },
      typ: { type: DataTypes.INTEGER },
      debt_typ: { type: DataTypes.INTEGER },
      code2: { type: DataTypes.INTEGER },
      load_dt: { type: DataTypes.DATE },
      r_calc_rule_id: { type: DataTypes.INTEGER },
      real_load_dt: { type: DataTypes.DATE },
      r_com_rule_id: { type: DataTypes.INTEGER },
      prior: { type: DataTypes.INTEGER },
      provided_legal: { type: DataTypes.INTEGER },
      sector: { type: DataTypes.INTEGER },
      grade: { type: DataTypes.INTEGER },
      contract_typ: { type: DataTypes.INTEGER },
      aggressive_plan: { type: DataTypes.MONEY },
      objective_plan: { type: DataTypes.MONEY },
      purchase_price: { type: DataTypes.MONEY },
      forecast: { type: DataTypes.MONEY },
      last_pay_date: { type: DataTypes.DATE },
      payments_until_dt: { type: DataTypes.DATE },
      Direction: { type: DataTypes.INTEGER },
      auto_fix_period: { type: DataTypes.INTEGER },
      auto_user_id: { type: DataTypes.INTEGER },
      sale_price: { type: DataTypes.MONEY },
    },
    {
      sequelize,
      modelName: "Portfolio",
      tableName: "portfolio",
      createdAt: "load_dt",
      updatedAt: false,
    }
  );
  return Model;
};
