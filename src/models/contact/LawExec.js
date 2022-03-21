import { DataTypes, Model } from "sequelize";
import { asoc } from "../../utils/asoc";
import moment from "moment";
export const name = "LawExec";
/**
 *
 * @param {@param {import("sequelize").Sequelize} sequelize} sequelize
 */
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      r_person_id: { type: DataTypes.INTEGER },
      r_debt_id: { type: DataTypes.INTEGER },
      r_portfolio_id: { type: DataTypes.INTEGER },
      total_sum: { type: DataTypes.MONEY },
      r_user_id: { type: DataTypes.INTEGER },
      court_doc_num: { type: DataTypes.VARCHAR(32) },
      court_name: { type: DataTypes.VARCHAR(128) },
      court_date: { type: DataTypes.DATE },
      fssp_name: { type: DataTypes.VARCHAR(64) },
      fssp_doc_num: { type: DataTypes.VARCHAR(64) },
      fssp_date: { type: DataTypes.DATE },
      start_date: { type: DataTypes.DATE },
      deposit_typ: { type: DataTypes.INTEGER },
      officer_fio: { type: DataTypes.VARCHAR(32) },
      officer_phone: { type: DataTypes.VARCHAR(32) },
      officer_room: { type: DataTypes.VARCHAR(8) },
      officer_fio2: { type: DataTypes.VARCHAR(32) },
      officer_phone2: { type: DataTypes.VARCHAR(32) },
      officer_room2: { type: DataTypes.VARCHAR(8) },
      status: { type: DataTypes.INTEGER },
      finish_date: { type: DataTypes.DATE },
      finish_reason: { type: DataTypes.INTEGER },
      dsc: { type: DataTypes.VARCHAR(4000) },
      instruct: { type: DataTypes.VARCHAR(512) },
      r_court_id: { type: DataTypes.INTEGER },
      r_act_id: { type: DataTypes.INTEGER },
      state: { type: DataTypes.INTEGER },
      contract: { type: DataTypes.VARCHAR(128) },
      currency: { type: DataTypes.INTEGER },
      int_color: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING(256) },
      typ_name: { type: DataTypes.INTEGER },
      due_sum: { type: DataTypes.MONEY },
      uncollectibility_act: { type: DataTypes.VARCHAR(64) },
      load_dt: {
        type: DataTypes.DATE,
      },
      receipt_act_dt: { type: DataTypes.DATE },
      executive_typ: { type: DataTypes.INTEGER },
      entry_force_dt: { type: DataTypes.DATE },
      reject_reason: { type: DataTypes.INTEGER },
      reject_date: { type: DataTypes.DATE },
      complete_date: { type: DataTypes.DATE },
      receipt_arrest_dt: { type: DataTypes.DATE },
      receipt_recover_dt: { type: DataTypes.DATE },
      settlement_sum: { type: DataTypes.MONEY },
      settlement_date: { type: DataTypes.DATE },
      fssp_plan_date: { type: DataTypes.DATE },
      complete_plan_date: { type: DataTypes.DATE },
      restriction_to_leave_dt: { type: DataTypes.DATE },
      dict_value_1: { type: DataTypes.INTEGER },
      r_address_id: { type: DataTypes.INTEGER },
      ext_id$: { type: DataTypes.VARCHAR(32) },
      DT_TO_ARCHIVE: { type: DataTypes.DATE },
      PAUSE_DATE: { type: DataTypes.DATE },
      PAUSE_REASON: { type: DataTypes.INTEGER },
      REST_SUM: { type: DataTypes.MONEY },
      DELIVERY_TYP: { type: DataTypes.INTEGER },
      QUORUM_ID: { type: DataTypes.INTEGER },
      APPEAL_DATE: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "LawExec",
      tableName: "law_exec",
      createdAt: "load_dt",
      hasTrigger: true,
      updatedAt: false,
    }
  );
  return Model;
};
/**
 *
 * @param {import("sequelize").Sequelize} sequelize
 */
export const join = (sequelize) => {
  asoc(sequelize.models.LawExec, sequelize.models.LawAct, "r_act_id");
  asoc(sequelize.models.LawExec, sequelize.models.Debt, "r_debt_id");
  asoc(sequelize.models.LawExec, sequelize.models.Person, "r_person_id");
  asoc(sequelize.models.LawExec, sequelize.models.LawCourt, "r_court_id");
  asoc(sequelize.models.LawExec, sequelize.models.Portfolio, "r_portfolio_id");
  asoc(
    sequelize.models.LawExec,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 77 },
      join: { key: "code", value: "state" },
      name: "State",
    },
    "complex"
  );
  asoc(
    sequelize.models.LawExec,
    sequelize.models.Dict,
    {
      where: { key: "parent_id", value: 124 },
      join: { key: "code", value: "executive_typ" },
      name: "Typ",
    },
    "complex"
  );
};
