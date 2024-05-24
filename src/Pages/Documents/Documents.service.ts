import { ConstValue, DocAttach, LawAct, LawExec, User } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Downloader } from 'src/utils/downloader';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { SMBService } from '@tools/nestjs-smb2';
import mime from 'mime-types';
import contentDisposition from 'content-disposition';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly ModelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact')
    private readonly ModelLawAct: typeof LawAct,
    @InjectModel(DocAttach, 'contact')
    private readonly ModelDocAttach: typeof DocAttach,
    @InjectModel(User, 'contact') private readonly ModelUser: typeof User,
    @InjectModel(ConstValue, 'contact')
    private readonly ModelConstValue: typeof ConstValue,
    private readonly smb: SMBService,
    private downloader: Downloader,
  ) {}
  get(id: number) {
    return from(
      this.ModelConstValue.findOne({
        where: { name: 'DocAttach.SavePath' },
        rejectOnEmpty: true,
      }),
    ).pipe(
      map((data) => data.value!),
      mergeMap((save_path) => {
        const tmp = save_path.split('\\');
        const dir = tmp[tmp.length - 1];
        return from(
          this.ModelDocAttach.findByPk(id, { rejectOnEmpty: true }),
        ).pipe(
          map((doc) => {
            const path = doc!.REL_SERVER_PATH.replaceAll('\\', '');
            const file = this.smb.readFileStream(
              `${dir}\\${path}\\${doc!.FILE_SERVER_NAME}`,
            );
            return {
              file,
              mime: mime.lookup(doc!.filename) || 'application/pdf',
              disposition: contentDisposition(doc!.filename, {
                type: 'inline',
              }),
            };
          }),
        );
      }),
    );
  }
  //Получение вложений по исполнительному производству
  getAllLawExecDocAttachs(law_exec_id: number): Observable<DocAttach[]> {
    const law_exec_doc_attach = from(
      this.ModelLawExec.findOne({
        where: { id: law_exec_id },
        include: [{ model: this.ModelDocAttach, include: [this.ModelUser] }],
        rejectOnEmpty: true,
      }),
    ).pipe(map((law_exec) => law_exec.DocAttachs!));
    return law_exec_doc_attach;
  }
  //Получение вложений по судебной работе
  getAllLawActDocAttachs(law_act_id: number): Observable<DocAttach[]> {
    const law_act_doc_attach = from(
      this.ModelLawAct.findOne({
        where: { id: law_act_id },
        include: [{ model: this.ModelDocAttach, include: [this.ModelUser] }],
        rejectOnEmpty: true,
      }),
    ).pipe(map((law_act) => law_act.DocAttachs!));
    return law_act_doc_attach;
  }

  upload(
    file: Express.Multer.File,
    id: number,
    auth: AuthResult,
  ): Observable<number> {
    return from(
      this.ModelLawExec.findByPk(id, {
        rejectOnEmpty: new NotFoundException('Такое дело не найдено'),
      }),
    ).pipe(
      mergeMap((le) =>
        this.downloader
          .uploadFile(file.originalname, file.buffer, auth.userContact!, id)
          .pipe(
            mergeMap((data) => this.ModelDocAttach.create(data)),
            mergeMap((doc) =>
              from(
                le.createLawExecProtokol({
                  r_user_id: auth.userContact!.id,
                  typ: 8,
                  r_doc_attach_id: doc.id,
                  dsc: `Вложение: ${doc.name}`,
                }),
              ).pipe(map(() => doc)),
            ),
            map((doc) => doc.id),
          ),
      ),
    );
  }
  remove(id: number, auth: AuthResult) {
    return from(
      this.ModelDocAttach.findByPk(id, {
        rejectOnEmpty: new NotFoundException('Файл не найден'),
      }),
    ).pipe(
      mergeMap((doc) =>
        doc.obj_id
          ? of(doc)
          : throwError(
              () =>
                new BadRequestException(
                  'Выбранный файл находится не в Исполнительном производстве',
                ),
            ),
      ),
      mergeMap((doc) =>
        from(
          this.ModelLawExec.findByPk(doc.r_id, { rejectOnEmpty: true }),
        ).pipe(
          mergeMap((le) =>
            from(
              le.createLawExecProtokol({
                r_user_id: auth.userContact!.id,
                typ: 10,
                dsc: `Вложение: ${doc.name}, версия: ${doc.vers1}.${doc.vers2}`,
              }),
            ).pipe(map(() => le)),
          ),
          map(() => doc),
        ),
      ),
      mergeMap((doc) =>
        this.downloader.removeFile(doc).pipe(mergeMap(() => doc.destroy())),
      ),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
