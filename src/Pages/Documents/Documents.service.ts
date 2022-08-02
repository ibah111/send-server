import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { SMB } from 'src/utils/smb';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(LawExec) private readonly ModelLawExec: typeof LawExec,
    @InjectModel(DocAttach) private readonly ModelDocAttach: typeof DocAttach,
    @InjectModel(User) private readonly ModelUser: typeof User,
    @InjectModel(ConstValue)
    private readonly ModelConstValue: typeof ConstValue,
    private readonly smb: SMB,
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
    const path = doc.REL_SERVER_PATH.replaceAll('\\', '');
    const client = this.smb.get();
    const file = await client.readFile(
      `${dir}\\${path}\\${doc.FILE_SERVER_NAME}`,
    );
    return file;
  }
  async getAll(id: number) {
    const law_exec = await this.ModelLawExec.findOne({
      where: { id },
      include: [{ model: this.ModelDocAttach, include: [this.ModelUser] }],
    });
    return law_exec.DocAttachs;
  }
}
