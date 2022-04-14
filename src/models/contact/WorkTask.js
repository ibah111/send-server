import { DataTypes, Model } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "WorkTask";
/**
 *
 * @param {@param {import("sequelize").Sequelize} sequelize} sequelize
 */
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      r_debt_id: { type: DataTypes.INTEGER },
      r_user_id: { type: DataTypes.INTEGER },
      prior: { type: DataTypes.INTEGER },
      call_time: { type: DataTypes.DATE },
      r_admin_id: { type: DataTypes.INTEGER },
      r_contact_id: { type: DataTypes.INTEGER },
      reason: { type: DataTypes.INTEGER },
      start_work_date: { type: DataTypes.DATE },
      finish_work_date: { type: DataTypes.DATE },
      reason_soft: { type: DataTypes.INTEGER },
      reason_hard: { type: DataTypes.INTEGER },
      office_time: { type: DataTypes.DATE },
      r_user_id_h: { type: DataTypes.INTEGER },
      r_user_id_l: { type: DataTypes.INTEGER },
      PLAN_FINISH_WORK_DATE: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "WorkTask",
      tableName: "work_task",
      createdAt: false,
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
  asoc(sequelize.models.WorkTask, sequelize.models.User, "r_user_id");
  asoc(sequelize.models.WorkTask, sequelize.models.Debt, "r_debt_id");
};
