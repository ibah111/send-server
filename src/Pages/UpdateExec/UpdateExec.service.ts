import { DocAttach, LawExec } from '@contact/models';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Attributes, MIS } from '@sql-tools/sequelize';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Downloader } from 'src/utils/downloader';
import { Helper } from 'src/utils/helper';
import { UpdateExecInput } from './UpdateExec.input';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import getContextTransaction from 'src/utils/getContextTransaction';
import { lastValueFrom } from 'rxjs';
function transform<T extends keyof Attributes<LawExec> & keyof UpdateExecInput>(
  name: T,
  value: LawExec[T],
): LawExec[T] {
  if (value) {
    switch (name) {
      case 'load_dt':
        return moment(value as Date).toDate() as LawExec[T];
      case 'court_date':
        return moment(value as Date)
          .startOf('day')
          .toDate() as LawExec[T];
      case 'entry_force_dt':
        return moment(value as Date)
          .startOf('day')
          .toDate() as LawExec[T];
      case 'receipt_recover_dt':
        return moment(value as Date)
          .startOf('day')
          .toDate() as LawExec[T];
      case 'fssp_date':
        return moment(value as Date)
          .startOf('day')
          .toDate() as LawExec[T];
      default:
        return value;
    }
  } else {
    if (name === 'total_sum' && (value === null || value === 0))
      return 0 as LawExec[T];
    return null as LawExec[T];
  }
}
const strings: (keyof UpdateExecInput & keyof Attributes<LawExec>)[] = [
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
const translate: Record<string, string> = {
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
  fssp_doc_num: 'Номер ФССП',
  start_date: 'Дата возбуждения',
  dsc: 'Коментарий',
  deposit_typ: 'Залоговое имущество',
};
const t = (value: string) => {
  if (translate[value]) return translate[value];
  return 'Не определено';
};
function updateData<V extends T[K], K extends keyof T, T extends LawExec>(
  data: T,
  key: K,
  value: V,
) {
  data[key] = value;
}
@Injectable()
export class UpdateExecService {
  constructor(
    @InjectConnection('contact') private readonly sequelize: Sequelize,
    @InjectModel(LawExec, 'contact')
    private readonly ModelLawExec: typeof LawExec,
    @InjectModel(DocAttach, 'contact')
    private readonly ModelDocAttach: typeof DocAttach,
    private readonly downloader: Downloader,
    private readonly helper: Helper,
  ) {}
  async changeDebtGuarantor(
    le: MIS<LawExec>,
    debt_guarantor: number,
    r_user_id: number,
  ) {
    const link = await le.getLawExecPersonLink();
    if (debt_guarantor > -1) {
      link.PERSON_ROLE = 2;
      if (link.PERSON_ID !== debt_guarantor) {
        link.PERSON_ID = debt_guarantor;
        await link.save();
        const dg = await link.getDebtGuarantor();
        await le.createLawExecProtokol({
          r_user_id,
          typ: 6,
          dsc: `Изменение стороны на поручителя "${dg.fio}"`,
        });
      }
    }
    if (link.PERSON_ROLE === 2 && debt_guarantor === -1) {
      link.PERSON_ROLE = 1;
      link.PERSON_ID = le.r_person_id;
      await link.save();
      await le.createLawExecProtokol({
        r_user_id,
        typ: 6,
        dsc: `Изменение стороны на должника`,
      });
    }
  }
  async update(body: UpdateExecInput, auth: AuthResult) {
    if (auth.userContact !== null) {
      const le = (await this.ModelLawExec.findByPk(body.id))!;
      this.changeDebtGuarantor(le, body.debt_guarantor, auth.userContact.id);
      for (const value of strings) {
        updateData(le, value, transform(value, body[value]));
      }
      le.fssp_doc_num = null;
      le.start_date = null;
      le.deposit_typ = body.person_property ? 1 : null;
      const changes = le.changed();
      if (changes) {
        const transaction = await getContextTransaction(
          this.sequelize,
          auth.userContact.id,
        );
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
        const la = await le.getLawAct();
        if (la !== null) {
          if (la.typ !== 1) {
            la.act_status = 13;
          } else {
            la.status = 9;
          }
          await la.save({ transaction });
          await transaction.commit();
          await la.createLawActProtokol({
            r_user_id: auth.userContact.id,
            typ: 36,
            dsc: `Перевод исполнительного документа на исполнительное производство. ID исп. док-та = ${le.id}`,
          });
        }
        const changes = le.changed() as (keyof Attributes<LawExec>)[];
        if (changes) {
          const transaction = await getContextTransaction(
            this.sequelize,
            auth.userContact.id,
          );
          for (const change of changes) {
            switch (change) {
              case 'r_court_id':
                await le.createLawExecProtokol({
                  r_user_id: auth.userContact.id,
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
              case 'dsc':
                await le.createLawExecProtokol({
                  r_user_id: auth.userContact.id,
                  typ: 2,
                  dsc: `${t(change)}. Новое значение: "${await this.helper.help(
                    change,
                    le[change],
                  )}".`,
                });
                break;
              case 'state':
                switch (le.previous(change)) {
                  case 13:
                    await le.createLawExecProtokol({
                      r_user_id: auth.userContact.id,
                      typ: 30,
                      dsc: `Перевод исполнительного документа на исполнительное производство`,
                    });
                    break;
                  default:
                    await le.createLawExecProtokol({
                      r_user_id: auth.userContact.id,
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
                await le.createLawExecProtokol({
                  r_user_id: auth.userContact.id,
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
          await le.save({ transaction });
          await transaction.commit();
        }
      }
      const doc_name = `Сопровод к ИД ${le
        .court_doc_num!.replaceAll('\\', '-')
        .replaceAll('/', '-')} ${await this.helper.help(
        'executive_typ',
        le.executive_typ,
      )} ${moment(le.court_date).utcOffset(3).format('DD.MM.YYYY')}.pdf`;
      const data = await lastValueFrom(
        this.downloader.downloadFile(
          auth.userContact,
          le,
          doc_name,
          body.template_typ,
          { addInterests: body.add_interests },
          auth.user.token,
        ),
      );
      if (data.file) {
        if (body.options?.save_file) {
          const doc = await this.ModelDocAttach.create(data.sql);
          await le.createLawExecProtokol({
            r_user_id: auth.userContact.id,
            typ: 8,
            r_doc_attach_id: doc.id,
            dsc: `Вложение: ${doc.name}`,
          });
          const debt = await le.getDebt();
          const transaction = await getContextTransaction(
            this.sequelize,
            auth.userContact.id,
          );
          debt!.law_exec_flag = 1;
          await debt!.save({ transaction });
          await transaction.commit();
        }
        return { file: data.file, name: data.sql.name };
      }
      return null;
    } else {
      return false;
    }
  }
}
