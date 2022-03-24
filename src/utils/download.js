import { v4 as uuidv4 } from "uuid";
import smb from "./smb";
import axios from "axios";
import moment from "moment";
const uploadSmb = (doc_name, save_path, path, file, OpUser, id) =>
  new Promise((resolve, reject) => {
    const data = {
      name: doc_name,
      filename: doc_name,
      r_user_id: OpUser.id,
      r_id: id,
      SAVE_MODE: 2,
      CHANGE_DT: moment().toDate(),
      obj_id: 47,
      REL_SERVER_PATH: `\\${path}\\`,
      FILE_SERVER_NAME: `${uuidv4().toUpperCase()}..pdf`,
    };
    let tmp = save_path.split("\\");
    const dir = tmp[tmp.length - 1];
    const client = smb();
    client.exists(`${dir}\\${path}`, (err, exists) => {
      if (err) throw err;
      if (exists) {
        client.writeFile(
          `${dir}\\${path}\\${data.FILE_SERVER_NAME}`,
          file,
          (err) => {
            if (err) throw err;
            resolve(data);
          }
        );
      } else {
        client.mkdir(`${dir}\\${path}`, (err) => {
          if (err) throw err;
          client.writeFile(
            `${dir}\\${path}\\${data.FILE_SERVER_NAME}`,
            file,
            (err) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      }
    });
  });
/**
 * @typedef {Object} Sql
 * @property {import("sequelize").Sequelize} Sql.local
 * @property {import("sequelize").Sequelize} Sql.contact
 */
/**
 * @param {Sql} sql
 */
export default (sql) => async (OpUser, le, doc_name) => {
  const count = await sql.contact.models.DocAttach.findOne({
    attributes: [
      "REL_SERVER_PATH",
      [sql.contact.fn("COUNT", sql.contact.col("id")), "count"],
    ],
    group: "REL_SERVER_PATH",
    order: [[sql.contact.fn("MAX", sql.contact.col("id")), "DESC"]],
  });
  let path = count.REL_SERVER_PATH.replaceAll("\\", "");
  path = Number(path);
  if (count.count === 1000) {
    path += 1;
  }
  path = String(path);
  const save_path = (
    await sql.contact.models.ConstValue.findOne({
      where: { name: "DocAttach.SavePath" },
    })
  ).value;
  const file = await axios({
    method: "get",
    url: `${server("fastreport")}/report=16.fr3&id=${le.id}&format=pdf`,
    responseType: "arraybuffer",
  });
  const data = await uploadSmb(
    doc_name,
    save_path,
    path,
    file.data,
    OpUser,
    le.id
  );
  return { file: file, sql: data };
};
