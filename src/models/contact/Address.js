import { DataTypes, Model } from "@contact/sequelize";
import { asoc } from "../../utils/asoc";
export const name = "Address";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      parent_id: { type: DataTypes.INTEGER },
      country: { type: DataTypes.VARCHAR(32) },
      city: { type: DataTypes.VARCHAR(64) },
      index_code: { type: DataTypes.VARCHAR(16) },
      street: { type: DataTypes.VARCHAR(64) },
      house: { type: DataTypes.VARCHAR(16) },
      building: { type: DataTypes.VARCHAR(16) },
      flat: { type: DataTypes.VARCHAR(20) },
      typ: { type: DataTypes.INTEGER },
      dsc: { type: DataTypes.VARCHAR(128) },
      block_flag: { type: DataTypes.INTEGER },
      oblast: { type: DataTypes.VARCHAR(64) },
      district: { type: DataTypes.VARCHAR(64) },
      r_street_id: { type: DataTypes.INTEGER },
      r_kladr_id: { type: DataTypes.VARCHAR(13) },
      visit_state: { type: DataTypes.INTEGER },
      full_adr: { type: DataTypes.VARCHAR(256) },
      id$: { type: DataTypes.INTEGER },
      load_dt: { type: DataTypes.DATE },
      status: { type: DataTypes.INTEGER },
      last_dt: { type: DataTypes.DATE },
      is_returned: { type: DataTypes.INTEGER },
      dataq_state: { type: DataTypes.INTEGER },
      is_residence: { type: DataTypes.INTEGER },
      visit_time: { type: DataTypes.DATE },
      r_debt_guarantor_id: { type: DataTypes.INTEGER },
      r_person_property_id: { type: DataTypes.INTEGER },
      text_flag: { type: DataTypes.INTEGER },
      okato: { type: DataTypes.VARCHAR(11) },
      modify_dt: { type: DataTypes.DATE },
      r_kladr_street_id: { type: DataTypes.INTEGER },
      verification_dt: { type: DataTypes.DATE },
      EXT_ID$: { type: DataTypes.VARCHAR(32) },
      BLOCK_DT: { type: DataTypes.DATE },
      BLOCK_REASON: { type: DataTypes.INTEGER },
      FIAS_CODE: { type: DataTypes.STRING(40) },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "address",
      createdAt: "load_dt",
      updatedAt: "modify_dt",
    }
  );
  return model;
};
/**
 *
 * @param {import("@contact/sequelize").Sequelize} sequelize
 */
 export const join = (sequelize) => {
  asoc(sequelize.models.Address, sequelize.models.Person, "parent_id");
}
