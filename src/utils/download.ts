import { v4 as uuidv4 } from "uuid";
import smb from "./smb";
import axios from "axios";
import moment from "moment";
import server from "./server";
import { Sql } from "./sql";
type uploads = {
  name: string;
  filename: string;
  r_user_id: any;
  r_id: number;
  SAVE_MODE: number;
  CHANGE_DT: Date;
  obj_id: number;
  REL_SERVER_PATH: string;
  FILE_SERVER_NAME: string;
};
const template = (id: number) => {
  switch (id) {
    case 16:
      return 16;
    case 17:
      return 17;
    default:
      return 16;
  }
};
const uploadSmb = (
  doc_name: string,
  save_path: string,
  path: string,
  file: Buffer,
  OpUser: any,
  id: number
) =>
  new Promise<uploads>((resolve, reject) => {
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
          (err: any) => {
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
            (err: any) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      }
    });
  });
export default (sql: Sql) =>
  async (OpUser: any, le: any, doc_name: string, template_id: number) => {
    const count: any = await sql.contact.models.DocAttach.findOne({
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
    const save_path: string = (
      (await sql.contact.models.ConstValue.findOne({
        where: { name: "DocAttach.SavePath" },
      })) as any
    ).value;
    const file = await axios.get<Buffer>(
      `${server("fastreport")}/report=${template(template_id)}.fr3&id=${
        le.id
      }&format=pdf`,
      {
        responseType: "arraybuffer",
      }
    );
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
