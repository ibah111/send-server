import { DataTypes, Model } from "sequelize";
export const name = "Person";
export const model = (sequelize) => {
  class model extends Model {}
  model.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      f: { type: DataTypes.VARCHAR(256) },
      i: { type: DataTypes.VARCHAR(160) },
      o: { type: DataTypes.VARCHAR(160) },
      birth_date: { type: DataTypes.DATE },
      importance: { type: DataTypes.INTEGER },
      decency: { type: DataTypes.INTEGER },
      r_passport_id: { type: DataTypes.INTEGER },
      company_name: { type: DataTypes.VARCHAR(128) },
      position: { type: DataTypes.VARCHAR(500) },
      dsc: { type: DataTypes.VARCHAR(5000) },
      depart: { type: DataTypes.VARCHAR(16) },
      family_status: { type: DataTypes.INTEGER },
      sex: { type: DataTypes.STRING(1) },
      education: { type: DataTypes.INTEGER },
      email: { type: DataTypes.STRING(64) },
      id$: { type: DataTypes.INTEGER },
      typ: { type: DataTypes.INTEGER },
      inn: { type: DataTypes.VARCHAR(16) },
      kpp: { type: DataTypes.VARCHAR(16) },
      okved: { type: DataTypes.VARCHAR(16) },
      okpo: { type: DataTypes.VARCHAR(10) },
      r_account: { type: DataTypes.VARCHAR(20) },
      b_name: { type: DataTypes.VARCHAR(192) },
      k_account: { type: DataTypes.VARCHAR(20) },
      bik: { type: DataTypes.VARCHAR(10) },
      director_fio: { type: DataTypes.VARCHAR(64) },
      ogrn: { type: DataTypes.VARCHAR(16) },
      load_dt: { type: DataTypes.DATE },
      website: { type: DataTypes.VARCHAR(64) },
      analyst_dsc: { type: DataTypes.TEXT },
      income: { type: DataTypes.MONEY },
      flag_workplace_validated: { type: DataTypes.INTEGER },
      birth_place: { type: DataTypes.VARCHAR(128) },
      ext_id$: { type: DataTypes.VARCHAR(32) },
      ARCHIVE_DT: { type: DataTypes.DATE },
      DOCFLOW_DSC: { type: DataTypes.STRING(512) },
    },
    {
      sequelize,
      modelName: "Person",
      tableName: "person",
      createdAt: "load_dt",
      updatedAt: false,
    }
  );
  return Model;
};
