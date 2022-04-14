import { DataTypes, Model } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "LawAct";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      r_person_id: { type: DataTypes.INTEGER },
      r_debt_id: { type: DataTypes.INTEGER },
      r_portfolio_id: { type: DataTypes.INTEGER },
      typ: { type: DataTypes.INTEGER },
      fd: { type: DataTypes.DATE },
      court_name: { type: DataTypes.VARCHAR(128) },
      court_adres: { type: DataTypes.VARCHAR(128) },
      court_kind: { type: DataTypes.INTEGER },
      court_typ: { type: DataTypes.INTEGER },
      due_sum: { type: DataTypes.MONEY },
      total_sum: { type: DataTypes.MONEY },
      start_date: { type: DataTypes.MONEY },
      delivery_typ: { type: DataTypes.INTEGER },
      court_order_period: { type: DataTypes.INTEGER },
      court_order_date: { type: DataTypes.DATE },
      court_order_delivery: { type: DataTypes.INTEGER },
      receipt_date: { type: DataTypes.DATE },
      status: { type: DataTypes.INTEGER },
      full_strength: { type: DataTypes.INTEGER },
      court_pre_fio: { type: DataTypes.VARCHAR(32) },
      court_pre_date: { type: DataTypes.DATE },
      court_pre_def: { type: DataTypes.VARCHAR(256) },
      court_fio: { type: DataTypes.VARCHAR(32) },
      court_date: { type: DataTypes.DATE },
      court_def: { type: DataTypes.VARCHAR(256) },
      act_status: { type: DataTypes.INTEGER },
      deadline: { type: DataTypes.DATE },
      dsc: { type: DataTypes.VARCHAR(4000) },
      instruct: { type: DataTypes.VARCHAR(512) },
      r_user_id: { type: DataTypes.INTEGER },
      r_court_id: { type: DataTypes.INTEGER },
      due_conf_sum: { type: DataTypes.MONEY },
      contract: { type: DataTypes.VARCHAR(128) },
      currency: { type: DataTypes.INTEGER },
      court_exec_date: { type: DataTypes.DATE },
      int_color: { type: DataTypes.INTEGER },
      name: { type: DataTypes.VARCHAR(256) },
      typ_name: { type: DataTypes.INTEGER },
      exec_number: { type: DataTypes.VARCHAR(32) },
      exec_date: { type: DataTypes.DATE },
      load_dt: { type: DataTypes.DATE },
      receipt_act_dt: { type: DataTypes.DATE },
      receipt_dt: { type: DataTypes.DATE },
      court_sum: { type: DataTypes.MONEY },
      terminate_contract_dt: { type: DataTypes.DATE },
      settlement_sum: { type: DataTypes.MONEY },
      settlement_date: { type: DataTypes.DATE },
      is_obtain_contract: { type: DataTypes.INTEGER },
      is_entire_amount: { type: DataTypes.INTEGER },
      failure_date: { type: DataTypes.DATE },
      correct_period_date: { type: DataTypes.INTEGER },
      due_pay_date: { type: DataTypes.DATE },
      due_pay_num: { type: DataTypes.INTEGER },
      user_result: { type: DataTypes.INTEGER },
      r_judge_id: { type: DataTypes.INTEGER },
      basic_sum: { type: DataTypes.MONEY },
      commission_sum: { type: DataTypes.MONEY },
      peni_basic_sum: { type: DataTypes.MONEY },
      peni_commission: { type: DataTypes.MONEY },
      peni_percent: { type: DataTypes.MONEY },
      peni_sum: { type: DataTypes.MONEY },
      percent_sum: { type: DataTypes.MONEY },
      act_direct: { type: DataTypes.INTEGER },
      dt_to_archive: { type: DataTypes.DATE },
      inner_number: { type: DataTypes.VARCHAR(32) },
      PENALTY_SUM: { type: DataTypes.MONEY },
      PRE_ACT_STATUS: { type: DataTypes.INTEGER },
      dict_value_1: { type: DataTypes.INTEGER },
      r_address_id: { type: DataTypes.INTEGER },
      ext_id$: { type: DataTypes.INTEGER },
      R_LAW_ACT_ID: { type: DataTypes.INTEGER },
      ACT_SUBJECT: { type: DataTypes.INTEGER },
      STRING_VALUE_1: { type: DataTypes.STRING(256) },
      R_COMMON_LAW_ACT_ID: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "LawAct",
      tableName: "law_act",
      createdAt: "load_dt",
      updatedAt: false,
    }
  );
  return Model;
};
/**
 *
 * @param {import("@contact/sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {
  asoc(sequelize.models.LawAct, sequelize.models.Debt, "r_debt_id");
  asoc(sequelize.models.LawAct, sequelize.models.Person, "r_person_id");
  asoc(sequelize.models.LawAct, sequelize.models.LawCourt, "r_court_id");
  asoc(sequelize.models.LawAct, sequelize.models.Portfolio, "r_portfolio_id");
  asoc(
    sequelize.models.LawAct,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 18 },
      join: { key: "code", value: "status" },
      name: "Status",
    },
    "complex"
  );
  asoc(
    sequelize.models.LawAct,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 25 },
      join: { key: "code", value: "act_status" },
      name: "ActStatus",
    },
    "complex"
  );
};
