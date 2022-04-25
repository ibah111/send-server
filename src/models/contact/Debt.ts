import { DataTypes, Model, Sequelize } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "Debt";
export const model = (sequelize: Sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parent_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING(256) },
      credit_date: { type: DataTypes.DATE },
      interest_rate: { type: DataTypes.MONEY },
      penalty: { type: DataTypes.VARCHAR(256) },
      start_date: { type: DataTypes.DATE },
      deadline: { type: DataTypes.DATE },
      debt_sum: { type: DataTypes.MONEY },
      total_sum: { type: DataTypes.MONEY },
      status: { type: DataTypes.INTEGER },
      dsc: { type: DataTypes.VARCHAR(512) },
      contract: { type: DataTypes.VARCHAR(128) },
      account: { type: DataTypes.VARCHAR(32) },
      city_name: { type: DataTypes.VARCHAR(64) },
      min_sum: { type: DataTypes.MONEY },
      currency: { type: DataTypes.INTEGER },
      typ: { type: DataTypes.INTEGER },
      reason: { type: DataTypes.INTEGER },
      start_sum: { type: DataTypes.MONEY },
      int_color: { type: DataTypes.INTEGER },
      flag_no_work: { type: DataTypes.INTEGER },
      r_lock_user_id: { type: DataTypes.INTEGER },
      rep_text: { type: DataTypes.VARCHAR(1024) },
      offer_text: { type: DataTypes.VARCHAR(256) },
      basic_sum: { type: DataTypes.MONEY },
      exp_basic_sum: { type: DataTypes.MONEY },
      percent_sum: { type: DataTypes.MONEY },
      exp_percent_sum: { type: DataTypes.MONEY },
      penalty_sum: { type: DataTypes.MONEY },
      peni_sum: { type: DataTypes.MONEY },
      commission_sum: { type: DataTypes.MONEY },
      due_sum: { type: DataTypes.MONEY },
      r_portfolio_id: { type: DataTypes.INTEGER },
      state: { type: DataTypes.INTEGER },
      prev_state: { type: DataTypes.INTEGER },
      filial: { type: DataTypes.INTEGER },
      dpd: { type: DataTypes.INTEGER },
      gmt: { type: DataTypes.INTEGER },
      id$: { type: DataTypes.INTEGER },
      debt_dt: { type: DataTypes.DATE },
      lock_dt: { type: DataTypes.DATE },
      load_dt: { type: DataTypes.DATE },
      debt_exp_dt: { type: DataTypes.DATE },
      lock_cnt: { type: DataTypes.INTEGER },
      agency_rate: { type: DataTypes.REAL },
      total_rest: { type: DataTypes.MONEY },
      filial_new: { type: DataTypes.INTEGER },
      ext_id: { type: DataTypes.VARCHAR(64) },
      last_pay: { type: DataTypes.DATE },
      exp_commission_sum: { type: DataTypes.MONEY },
      flag_preventive: { type: DataTypes.INTEGER },
      debt_sum_extra: { type: DataTypes.MONEY },
      last_pay_sum: { type: DataTypes.MONEY },
      law_act_flag: { type: DataTypes.INTEGER },
      law_exec_flag: { type: DataTypes.INTEGER },
      use_strategy: { type: DataTypes.INTEGER },
      strategy_id: { type: DataTypes.INTEGER },
      strategy_day: { type: DataTypes.INTEGER },
      strategy_block: { type: DataTypes.INTEGER },
      strategy_dt: { type: DataTypes.DATE },
      r_calc_id: { type: DataTypes.INTEGER },
      mark1: { type: DataTypes.INTEGER },
      mark2: { type: DataTypes.INTEGER },
      stock: { type: DataTypes.VARCHAR(64) },
      next_pay: { type: DataTypes.DATE },
      pos_name: { type: DataTypes.VARCHAR(256) },
      sum_on_bank_account: { type: DataTypes.MONEY },
      annuity_pay: { type: DataTypes.MONEY },
      fine_sum: { type: DataTypes.MONEY },
      next_pay_sum: { type: DataTypes.MONEY },
      r_portfolio_out_id: { type: DataTypes.INTEGER },
      archive_dt: { type: DataTypes.DATE },
      reason_status: { type: DataTypes.INTEGER },
      MARK3: { type: DataTypes.INTEGER },
      MARK4: { type: DataTypes.INTEGER },
      TEST_ID: { type: DataTypes.INTEGER },
      EXTENTION_DT: { type: DataTypes.DATE },
      R_BANK_REQUISITE_ID: { type: DataTypes.INTEGER },
      R_CALC_RULE_ID: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Debt",
      tableName: "debt",
      createdAt: "load_dt",
      updatedAt: false,
    }
  );
  return Model;
};
export const join = (sequelize: Sequelize) => {
  asoc(sequelize.models.Debt, sequelize.models.Person, "parent_id");
  asoc(sequelize.models.Debt, sequelize.models.Portfolio, "r_portfolio_id");
  asoc(
    sequelize.models.Debt,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 6 },
      join: { key: "code", value: "status" },
      name: "Status",
    },
    "complex"
  );
  asoc(
    sequelize.models.Debt,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 11 },
      join: { key: "code", value: "typ" },
      name: "Typ",
    },
    "complex"
  );
};
