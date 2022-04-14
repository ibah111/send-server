import { DataTypes, Model } from "@contact/sequelize";
export const name = "LawCourt";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      index_code: { type: DataTypes.VARCHAR(16) },
      name: { type: DataTypes.STRING(200) },
      address: { type: DataTypes.STRING(1000) },
      phone: { type: DataTypes.STRING(100) },
      court_typ: { type: DataTypes.INTEGER },
      district: { type: DataTypes.VARCHAR(64) },
      dsc: { type: DataTypes.VARCHAR(512) },
      typ: { type: DataTypes.INTEGER },
      recipient: { type: DataTypes.VARCHAR(256) },
      inn: { type: DataTypes.VARCHAR(16) },
      kpp: { type: DataTypes.VARCHAR(16) },
      bik: { type: DataTypes.VARCHAR(16) },
      cur_account: { type: DataTypes.VARCHAR(32) },
      corr_account: { type: DataTypes.VARCHAR(32) },
      bank: { type: DataTypes.VARCHAR(128) },
      kbk: { type: DataTypes.VARCHAR(32) },
      okato: { type: DataTypes.VARCHAR(16) },
      r_parent_id: { type: DataTypes.INTEGER },
      EXT_ID$: { type: DataTypes.STRING(32) },
      EMAIL: { type: DataTypes.STRING(64) },
      SITE: { type: DataTypes.STRING(128) },
      notary_typ: { type: DataTypes.INTEGER },
      notarial_authority: { type: DataTypes.STRING(1000) },
      GAS_JUSTICE_CODE: { type: DataTypes.STRING(8) },
      NOT_USED: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "LawCourt",
      tableName: "law_court",
      createdAt: false,
      updatedAt: false,
    }
  );
  return model;
};
