import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import moment from 'moment';
import server from './server';
import { Sequelize } from '@contact/sequelize-typescript';
import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { InjectModel, SequelizeModule } from '@contact/nestjs-sequelize';
import { SMB, SmbModule } from './smb';
import { Injectable, Module } from '@nestjs/common';
type uploads = {
  name: string;
  filename: string;
  r_user_id: number;
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
@Injectable()
export class Downloader {
  constructor(
    @InjectModel(DocAttach) private ModelDocAttach: typeof DocAttach,
    @InjectModel(ConstValue) private ModelConstValue: typeof ConstValue,
    private readonly smb: SMB,
  ) {}
  uploadSmb(
    doc_name: string,
    save_path: string,
    path: string,
    file: Buffer,
    OpUser: User,
    id: number,
  ) {
    return new Promise<uploads>((resolve) => {
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
      const tmp = save_path.split('\\');
      const dir = tmp[tmp.length - 1];
      const client = this.smb.get();
      client.exists(`${dir}\\${path}`, (err, exists) => {
        if (err) throw err;
        if (exists) {
          client.writeFile(
            `${dir}\\${path}\\${data.FILE_SERVER_NAME}`,
            file,
            (err: any) => {
              if (err) throw err;
              resolve(data);
            },
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
              },
            );
          });
        }
      });
    });
  }
  async uploadFile(doc_name: string, file: Buffer, OpUser: User, id: number) {
    const count: DocAttach & { count?: number } =
      await this.ModelDocAttach.findOne({
        attributes: [
          'REL_SERVER_PATH',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group: 'REL_SERVER_PATH',
        order: [[Sequelize.fn('MAX', Sequelize.col('id')), 'DESC']],
      });
    let path: number | string = count.REL_SERVER_PATH.replaceAll('\\', '');
    path = Number(path);
    if (count.count === 1000) {
      path += 1;
    }
    path = String(path);
    const save_path: string = (
      (await this.ModelConstValue.findOne({
        where: { name: 'DocAttach.SavePath' },
      })) as any
    ).value;
    return await this.uploadSmb(doc_name, save_path, path, file, OpUser, id);
  }
  async downloadFile(
    OpUser: User,
    le: LawExec,
    doc_name: string,
    template_id: number,
  ) {
    const url = `${server('fastreport')}/report=${template(
      template_id,
    )}.fr3&id=${le.id}&format=pdf`;
    const file = await axios.get<Buffer>(url, {
      responseType: 'arraybuffer',
    });
    const data = await this.uploadFile(doc_name, file.data, OpUser, le.id);
    return { file: file, sql: data };
  }
}
@Module({
  imports: [SmbModule, SequelizeModule.forFeature([DocAttach, ConstValue])],
  providers: [Downloader],
  exports: [Downloader],
})
export class DownloaderModule {}
