import { DocAttach, LawExec, User } from '@contact/models';
import { InjectModel } from '@contact/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { AuthUser } from 'src/utils/auth.guard';
import { Downloader } from 'src/utils/downloader';
import { Helper } from 'src/utils/helper';

const tranform = (name: string, value: any) => {
  if (value) {
    switch (name) {
      case 'load_dt':
        return moment(value).toDate();
      case 'court_date':
        return moment(value).startOf('day').toDate();
      case 'entry_force_dt':
        return moment(value).startOf('day').toDate();
      case 'receipt_recover_dt':
        return moment(value).startOf('day').toDate();
      case 'fssp_date':
        return moment(value).startOf('day').toDate();
      default:
        return value;
    }
  } else {
    return null;
  }
};
const data = [
  'total_sum',
  'load_dt',
  'court_doc_num',
  'executive_typ',
  'court_date',
  'DELIVERY_TYP',
  'entry_force_dt',
  'receipt_recover_dt',
  'fssp_date',
  'r_court_id',
];
const translate = {
  state: 'Статус',
  total_sum: 'Общая сумма',
  load_dt: 'Дата создания ИП',
  court_doc_num: '№ исп. документа',
  executive_typ: 'Тип исп. документа',
  court_date: 'Дата вынесения',
  DELIVERY_TYP: 'Способ подачи',
  entry_force_dt: 'Дата вступления в силу',
  receipt_recover_dt: 'Дата получения ИЛ на взыскание',
  fssp_date: 'Дата подачи',
  r_court_id: 'ФССП',
  dsc: 'Коментарий',
};
const t = (value: string) => {
  if (translate[value]) return translate[value];
  return 'Не определено';
};
@Injectable()
export class UpdateExecService {
  constructor(
    @InjectModel(User) private ModelUser: typeof User,
    @InjectModel(LawExec) private ModelLawExec: typeof LawExec,
    @InjectModel(DocAttach) private ModelDocAttach: typeof DocAttach,
    private readonly downloader: Downloader,
    private readonly helper: Helper,
  ) {}
  async update(body: any, user: AuthUser) {
    const OpUser = await this.ModelUser.findOne({
      where: { email: user.login },
    });
    if (OpUser !== null) {
      const le = await this.ModelLawExec.findByPk(body.id);
      for (const value of data) {
        le[value] = tranform(value, body[value]);
      }
      const changes = le.changed();
      if (changes) {
        le.state = 9;
        const new_dsc = `${moment()
          .utcOffset(3)
          .format('DD.MM.YYYY')} Сопровод к ИД ${
          le.court_doc_num
        } ${await this.helper.help('executive_typ', le.executive_typ)} ${moment(
          le.court_date,
        )
          .utcOffset(3)
          .format('DD.MM.YYYY')}`;
        if (le.dsc === 'Создается ИП из "Отправка"') {
          le.dsc = new_dsc;
        } else {
          if (!le.dsc) {
            le.dsc = '';
          } else {
            le.dsc += '\r\n';
          }
          le.dsc += new_dsc;
        }
        const la = await le.$get('LawAct');
        if (la !== null) {
          if (la.typ !== 1) {
            la.act_status = 13;
          } else {
            la.status = 9;
          }
          await la.save();
          await la.$create('LawActProtokol', {
            r_user_id: OpUser.id,
            typ: 36,
            dsc: `Перевод исполнительного документа на исполнительное производство. ID исп. док-та = ${le.id}`,
          });
        }
        const changes = le.changed();

        const doc_name = `Сопровод к ИД ${le.court_doc_num
          .replaceAll('\\', '-')
          .replaceAll('/', '-')} ${await this.helper.help(
          'executive_typ',
          le.executive_typ,
        )} ${moment(le.court_date).utcOffset(3).format('DD.MM.YYYY')}.pdf`;
        if (changes)
          for (const change of changes) {
            switch (change) {
              case 'r_court_id':
                await le.$create('LawExecProtokol', {
                  r_user_id: OpUser.id,
                  typ: 62,
                  dsc: `${t(change)}. Новое значение: "${await this.helper.help(
                    change,
                    le[change],
                  )}". Старое значение: "${await this.helper.help(
                    change,
                    le.previous(change),
                  )}".`,
                });
                break;
              case 'state':
                switch (le.previous(change)) {
                  case 13:
                    await le.$create('LawExecProtokol', {
                      r_user_id: OpUser.id,
                      typ: 30,
                      dsc: `Перевод исполнительного документа на исполнительное производство`,
                    });
                    break;
                  default:
                    await le.$create('LawExecProtokol', {
                      r_user_id: OpUser.id,
                      typ: 2,
                      dsc: `${t(
                        change,
                      )}. Новое значение: "${await this.helper.help(
                        change,
                        le[change],
                      )}". Старое значение: "${await this.helper.help(
                        change,
                        le.previous(change),
                      )}".`,
                    });
                    break;
                }
                break;
              default:
                await le.$create('LawExecProtokol', {
                  r_user_id: OpUser.id,
                  typ: 2,
                  dsc: `${t(change)}. Новое значение: "${await this.helper.help(
                    change,
                    le[change],
                  )}". Старое значение: "${await this.helper.help(
                    change,
                    le.previous(change),
                  )}".`,
                });
                break;
            }
          }
        await le.save();
        const data = await this.downloader.downloadFile(
          OpUser,
          le,
          doc_name,
          body.template_typ,
        );
        const doc = await this.ModelDocAttach.create(data.sql);
        await le.$create('LawExecProtokol', {
          r_user_id: OpUser.id,
          typ: 8,
          r_doc_attach_id: doc.id,
          dsc: `Вложение: ${doc.name}`,
        });
        return { file: data.file.data, name: data.sql.name };
      }
    } else {
      return false;
    }
  }
}
