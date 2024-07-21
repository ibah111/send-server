import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import moment from 'moment';
import server from './server';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { InjectModel, SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Injectable, Module } from '@nestjs/common';
import { MIS } from '@sql-tools/sequelize';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { SMBService } from '@tools/nestjs-smb2';
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
  ): Observable<uploads> {
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
    return this.smb.exists(`${dir}\\${path}`).pipe(
      mergeMap((exists) => {
        if (!exists) {
          return this.smb.mkdir(`${dir}\\${path}`);
        }
        return of(exists);
      }),
      mergeMap(() =>
        this.smb.writeFile(`${dir}\\${path}\\${data.FILE_SERVER_NAME}`, file),
      ),
      map(() => data),
    );
  }
  removeSmb(
    save_path: string,
    path: string,
    file: string,
  ): Observable<boolean> {
    const tmp = save_path.split('\\');
    const dir = tmp[tmp.length - 1];
    return this.smb.unlink(`${dir}\\${path}\\${file}`);
  }
  removeFile(doc: DocAttach): Observable<boolean> {
    return from(
      this.ModelConstValue.findOne({
        where: { name: 'DocAttach.SavePath' },
        rejectOnEmpty: true,
      }),
    ).pipe(
      map((res) => res.value!),
      mergeMap((save_path) => {
        let path: number | string = doc.REL_SERVER_PATH.replaceAll('\\', '');
        path = String(path);
        return this.removeSmb(save_path, path, doc.FILE_SERVER_NAME);
      }),
    );
  }
  uploadFile(doc_name: string, file: Buffer, OpUser: User, id: number) {
    return from(
      this.ModelDocAttach.findOne({
        attributes: [
          'REL_SERVER_PATH',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        group: 'REL_SERVER_PATH',
        order: [[Sequelize.fn('MAX', Sequelize.col('id')), 'DESC']],
      }) as Promise<MIS<DocAttach> & { dataValues: { count?: number } }>,
    ).pipe(
      mergeMap((count) =>
        from(
          this.ModelConstValue.findOne({
            where: { name: 'DocAttach.SavePath' },
            rejectOnEmpty: true,
          }),
        ).pipe(
          map((res) => res.value!),
          map((save_path) => ({ count, save_path })),
        ),
      ),
      mergeMap(({ count, save_path }) => {
        let path: number | string = count.REL_SERVER_PATH.replaceAll('\\', '');
        path = Number(path);
        if (count.dataValues.count === 1000) {
          path += 1;
        }
        path = String(path);
        return this.uploadSmb(doc_name, save_path, path, file, OpUser, id);
      }),
    );
  }
  downloadFile(
    OpUser: User,
    le: LawExec,
    doc_name: string,
    template_id: number,
    params: {
      addInterests?: boolean;
      appeal_typ?: number;
      customRequisitesId?: number;
    },
    token: string,
  ) {
    const download_url = `${server('fastreport')}/print/${template_id}`;
    console.log(download_url, token, params);
    const axios_request = axios.get<Buffer>(download_url, {
      responseType: 'arraybuffer',
      headers: { token },
      params: { ...params, id: le.id },
    });

    return from(axios_request).pipe(
      map((res) => res.data),
      mergeMap((file) =>
        this.uploadFile(doc_name, file, OpUser, le.id).pipe(
          map((sql) => ({
            file,
            sql,
          })),
        ),
      ),
    );
  }
}
@Module({
  imports: [SequelizeModule.forFeature([DocAttach, ConstValue], 'contact')],
  providers: [Downloader],
  exports: [Downloader],
})
export class DownloaderModule {}
