import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import moment from 'moment';
import server from './server';
import { Sequelize } from '@contact/sequelize-typescript';
import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { InjectModel, SequelizeModule } from '@contact/nestjs-sequelize';
import { Injectable, Module, NotFoundException } from '@nestjs/common';
import { SmbModule, SMBService } from '@tools/nestjs-smb2';
import config from '../config/smb.json';
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
@Injectable()
export class Downloader {
  constructor(
    @InjectModel(DocAttach, 'contact') private ModelDocAttach: typeof DocAttach,
    @InjectModel(ConstValue, 'contact')
    private ModelConstValue: typeof ConstValue,
    private readonly smb: SMBService,
  ) {}
  uploadSmb(
    doc_name: string,
    save_path: string,
    path: string,
    file: Buffer,
    OpUser: User,
    id: number,
  ) {
    return new Promise<uploads>((resolve, reject) => {
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
        if (err) reject(err);
        if (exists) {
          client.writeFile(
            `${dir}\\${path}\\${data.FILE_SERVER_NAME}`,
            file,
            (err: any) => {
              if (err) reject(err);
              resolve(data);
            },
          );
        } else {
          client.mkdir(`${dir}\\${path}`, (err) => {
            if (err) reject(err);
            client.writeFile(
              `${dir}\\${path}\\${data.FILE_SERVER_NAME}`,
              file,
              (err: any) => {
                if (err) reject(err);
                resolve(data);
              },
            );
          });
        }
      });
    });
  }
  removeSmb(save_path: string, path: string, file: string) {
    return new Promise<boolean>((resolve, reject) => {
      const tmp = save_path.split('\\');
      const dir = tmp[tmp.length - 1];
      const client = this.smb.get();
      client.exists(`${dir}\\${path}`, (err, exists) => {
        if (err) reject(err);
        if (exists) {
          client.unlink(`${dir}\\${path}\\${file}`, (err) => {
            if (err) reject(err);
            resolve(true);
          });
        } else {
          reject(new NotFoundException('Файл не найден в папке сервера'));
        }
      });
    });
  }
  async removeFile(doc: DocAttach) {
    const save_path: string = (await this.ModelConstValue.findOne({
      where: { name: 'DocAttach.SavePath' },
    }))!.value!;
    let path: number | string = doc.REL_SERVER_PATH.replaceAll('\\', '');
    path = String(path);
    const result = await this.removeSmb(save_path, path, doc.FILE_SERVER_NAME);
    return result;
  }
  async uploadFile(doc_name: string, file: Buffer, OpUser: User, id: number) {
    const count: DocAttach & { count?: number } =
      (await this.ModelDocAttach.findOne({
        attributes: [
          'REL_SERVER_PATH',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group: 'REL_SERVER_PATH',
        order: [[Sequelize.fn('MAX', Sequelize.col('id')), 'DESC']],
      }))!;
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
    params: { addInterests: boolean },
    token: string,
  ) {
    const file = await axios.get<Buffer>(
      `${server('fastreport')}/print/${template_id}`,
      {
        responseType: 'arraybuffer',
        headers: { token },
        params: { ...params, id: le.id },
      },
    );
    const data = await this.uploadFile(doc_name, file.data, OpUser, le.id);
    return { file: file, sql: data };
  }
}
@Module({
  imports: [
    SmbModule.register(config),
    SequelizeModule.forFeature([DocAttach, ConstValue], 'contact'),
  ],
  providers: [Downloader],
  exports: [Downloader],
})
export class DownloaderModule {}
