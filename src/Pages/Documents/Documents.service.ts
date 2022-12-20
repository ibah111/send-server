import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SMBService } from '@tools/nestjs-smb2';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Downloader } from 'src/utils/downloader';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly ModelLawExec: typeof LawExec,
    @InjectModel(DocAttach, 'contact')
    private readonly ModelDocAttach: typeof DocAttach,
    @InjectModel(User, 'contact') private readonly ModelUser: typeof User,
    @InjectModel(ConstValue, 'contact')
    private readonly ModelConstValue: typeof ConstValue,
    private readonly smb: SMBService,
    private downloader: Downloader,
  ) {}
  async get(id: number) {
    const save_path: string = (
      (await this.ModelConstValue.findOne({
        where: { name: 'DocAttach.SavePath' },
      })) as any
    ).value;
    const tmp = save_path.split('\\');
    const dir = tmp[tmp.length - 1];
    const doc = await this.ModelDocAttach.findByPk(id);
    const path = doc!.REL_SERVER_PATH.replaceAll('\\', '');
    const client = this.smb.get();
    const file = await client.readFile(
      `${dir}\\${path}\\${doc!.FILE_SERVER_NAME}`,
    );
    return file;
  }
  async getAll(id: number): Promise<DocAttach[]> {
    const law_exec = await this.ModelLawExec.findOne({
      where: { id },
      include: [{ model: this.ModelDocAttach, include: [this.ModelUser] }],
    });
    return law_exec!.DocAttachs!;
  }
  async upload(
    file: Express.Multer.File,
    id: number,
    auth: AuthResult,
  ): Promise<number> {
    const le = await this.ModelLawExec.findByPk(id);
    if (le) {
      const data = await this.downloader.uploadFile(
        file.originalname,
        file.buffer,
        auth.userContact!,
        id,
      );
      const doc = await this.ModelDocAttach.create(data);
      await le.$create('LawExecProtokol', {
        r_user_id: auth.userContact!.id,
        typ: 8,
        r_doc_attach_id: doc.id,
        dsc: `Вложение: ${doc.name}`,
      });
      return doc.id;
    } else {
      throw new NotFoundException('Такое дело не найдено');
    }
  }
  async remove(id: number, auth: AuthResult) {
    const doc = await this.ModelDocAttach.findByPk(id);
    if (doc) {
      if (doc.obj_id === 47) {
        const le = await this.ModelLawExec.findByPk(doc.r_id);
        await le!.$create('LawExecProtokol', {
          r_user_id: auth.userContact!.id,
          typ: 10,
          dsc: `Вложение: ${doc.name}, версия: ${doc.vers1}.${doc.vers2}`,
        });
        try {
          await this.downloader.removeFile(doc);
          await doc.destroy();
          return true;
        } catch (e) {
          if (e instanceof NotFoundException) {
            await doc.destroy();
            return false;
          }
          throw e;
        }
      } else {
        throw new BadRequestException(
          'Выбранный файл находится не в Исполнительном производстве',
        );
      }
    } else {
      throw new NotFoundException('Файл не найден');
    }
  }
}
