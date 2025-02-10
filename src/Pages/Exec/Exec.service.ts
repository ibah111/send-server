import { Dict, LawAct, LawExec } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from 'sequelize';
import { UpdateExecInput } from './UpdateExec/UpdateExec.input';
import { Attributes, MIS } from '@sql-tools/sequelize';
import moment from 'moment-timezone';
import { Helper } from 'src/utils/helper';
import truncator from 'src/utils/truncator';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { CreateLiteralAssociation } from '@sql-tools/association-literal';

@Injectable()
export default class ExecService {
  private translate: Record<string, string> = {
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
  t = (value: string) => {
    if (this.translate[value]) return this.translate[value];
    return 'Не определено';
  };

  private updateData<V extends T[K], K extends keyof T, T extends LawExec>(
    data: T,
    key: K,
    value: V,
  ) {
    data[key] = value;
  }

  private transform<
    T extends keyof Attributes<LawExec> & keyof UpdateExecInput,
  >(name: T, value?: LawExec[T]): LawExec[T] {
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
  strings: (keyof UpdateExecInput & keyof Attributes<LawExec>)[] = [
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

  async protokolChanges(
    changes: string[],
    law_exec: CreateLiteralAssociation<LawExec>,
    auth: AuthResult,
  ) {
    for (const change of changes as unknown as keyof Attributes<LawExec>) {
      switch (change) {
        case 'r_court_id':
          const r_court_id_value = `${this.t(change)}. Новое значение: "${await this.helper.help(
            change,
            law_exec[change],
          )}". Старое значение: "${await this.helper.help(
            change,
            law_exec.previous(change),
          )}".`;
          const comment = truncator(r_court_id_value);
          await law_exec.createLawExecProtokol({
            r_user_id: auth.userContact!.id,
            typ: 2,
            dsc: comment,
          });
          break;
        case 'dsc':
          const dsc = `${this.t(change)}. Новое значение: "${await this.helper.help(
            change,
            law_exec[change],
          )}".`;
          try {
            const comment = truncator(dsc);
            await law_exec.createLawExecProtokol({
              r_user_id: auth.userContact!.id,
              typ: 2,
              dsc: comment,
            });
          } catch (error) {
            //@ts-expect-error ///
            throw Error(error);
          }
          break;
        case 'state':
          switch (law_exec.previous(change)) {
            case 13:
              await law_exec.createLawExecProtokol({
                r_user_id: auth.userContact!.id,
                typ: 30,
                dsc: truncator(
                  `Перевод исполнительного документа на исполнительное производство`,
                ),
              });
              break;
            default:
              const value = `${this.t(
                change,
              )}. Новое значение: "${await this.helper.help(
                change,
                law_exec[change],
              )}". Старое значение: "${await this.helper.help(
                change,
                law_exec.previous(change),
              )}".`;
              const comment = truncator(value);

              await law_exec.createLawExecProtokol({
                r_user_id: auth.userContact!.id,
                typ: 2,
                dsc: comment,
              });
              break;
          }
          break;
        default:
          const value = `${this.t(change)}. Новое значение: "${await this.helper.help(
            change,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            law_exec[change],
          )}". Старое значение: "${await this.helper.help(
            change,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            law_exec.previous(change),
          )}".`;
          await law_exec.createLawExecProtokol({
            r_user_id: auth.userContact!.id,
            typ: 2,
            dsc: truncator(value),
          });
          break;
      }
    }
  }

  constructor(
    @InjectConnection('contact') private readonly sequelize: Sequelize,
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact')
    private readonly modelLawAct: typeof LawAct,
    @InjectModel(Dict, 'contact')
    private readonly modelDict: typeof Dict,
    private readonly helper: Helper,
  ) {}

  /**
   * Словарь 77, статусы ИП / ИД
   */
  async dicts(name: string) {
    const dicts = await this.modelDict.findAll({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: {
        parent_id: 77,
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    return dicts;
  }

  async typs(parent_id: number) {
    const typs = await this.modelDict.findAll({
      where: {
        parent_id,
      },
    });
    return typs;
  }

  /**
   * "Создать ИД"
по аналогии с кнопкой "Отправить", но сопровод не формируется, комментарий не добавляется
создается карточка ИП в статусе "не создано" с заполненными полями
   */
  async create(body: any, auth: AuthResult) {
    if (auth.userContact!.id) {
      const fio =
        auth.userContact!.f +
        ' ' +
        auth.userContact!.i +
        ' ' +
        auth.userContact!.o;
      const dsc = `ИП создано в статусе "Не создано" пользователем ${fio}`;
      const dicts = await this.dicts('Не создано');
      const state = dicts[0].code;
      try {
        return await this.modelLawExec
          .update(
            {
              ...body,
              state,
              dsc,
            },
            {
              where: {
                id: body.id,
              },
            },
          )
          .then(async (result) => {
            console.log(result);
            return true;
          });
      } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
      }
    }
  }

  /**
   * "Сохранить ИД"
по аналогии с кнопкой "Отправить", но сопровод не формируется, комментарий не добавляется. Просто сохранить данные в уже созданной карточке ИП
т.е как бы подготавливаем карточку ИП к отправке ИД на предъявление
   */
  async save(body: any, auth: AuthResult) {
    try {
      const law_exec = await this.modelLawExec.findOne({
        where: {
          id: body.id,
        },
        rejectOnEmpty: true,
      });
      return await law_exec
        .update({
          ...body,
        })
        .then(async (result) => {
          const changes = result.changed();
          console.log('changes: ', changes);
          if (!changes) return changes;
          else if (changes) {
            await this.protokolChanges(changes, result, auth).then(() => true);
          }
        });
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`);
    }
  }
}
