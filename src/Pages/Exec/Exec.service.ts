import { Dict, LawAct, LawExec } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { UpdateExecService } from './UpdateExec/UpdateExec.service';
import { Op } from 'sequelize';
import { UpdateExecInput } from './UpdateExec/UpdateExec.input';
import { Attributes } from '@sql-tools/sequelize';
import moment from 'moment-timezone';
import { Helper } from 'src/utils/helper';
import truncator from 'src/utils/truncator';
import getContextTransaction from 'src/utils/getContextTransaction';
import { Sequelize } from '@sql-tools/sequelize-typescript';

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
  constructor(
    @InjectConnection('contact') private readonly sequelize: Sequelize,
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
    @InjectModel(LawAct, 'contact')
    private readonly modelLawAct: typeof LawAct,
    @InjectModel(Dict, 'contact')
    private readonly modelDict: typeof Dict,
    private readonly updateExecService: UpdateExecService,
    private readonly helper: Helper,
  ) {}

  /**
   * Словарь 77, статусы ИП / ИД
   */
  async dicts(name: string) {
    const dicts = await this.modelDict.findAll({
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
  /**
   * "Создать ИД"
по аналогии с кнопкой "Отправить", но сопровод не формируется, комментарий не добавляется
создается карточка ИП в статусе "не создано" с заполненными полями
   */
  async createIp(body) {
    const not_created = await this.dicts('Не создано');
    const state = not_created[0].code;
    const law_exec = await this.modelLawExec.update(
      {
        ...body,
        state,
      },
      {
        where: {
          id: body.id,
        },
      },
    );
    return law_exec;
  }

  /**
   * "Сохранить ИД"
по аналогии с кнопкой "Отправить", но сопровод не формируется, комментарий не добавляется. Просто сохранить данные в уже созданной карточке ИП
т.е как бы подготавливаем карточку ИП к отправке ИД на предъявление
   */
  async saveId(body) {
    const law_exec = await this.modelLawExec.update(
      {
        ...body,
      },
      {
        where: {
          id: body.id,
        },
      },
    );
    return law_exec;
  }

  /**
   * Аналогия с кнопкой отправить
   */
  async updateAnalog(body: any, auth: any) {
    try {
      const law_exec = await this.modelLawExec.findByPk(body.id, {
        rejectOnEmpty: true,
      });
      const law_act = await this.modelLawAct.findOne({
        where: {
          id: law_exec.r_act_id!,
        },
        rejectOnEmpty: true,
      });
      await law_act.update({
        court_sum: body.court_sum,
        exec_number: body.exec_number,
      });
      await this.updateExecService.changeDebtGuarantor(
        law_exec,
        body.debt_guarantor,
        auth.userContact.id,
      );
      for (const value of this.strings) {
        this.updateData(law_exec, value, this.transform(value, body[value]));
      }
      law_exec.fssp_doc_num = null;
      law_exec.start_date = null;
      law_exec.deposit_typ = body.person_property ? 1 : null;
      const changes = law_exec.changed();
      if (changes) {
        const transaction = await getContextTransaction(
          this.sequelize,
          auth.userContact.id,
        );
        law_exec.state = 9;
        const new_dsc = `${moment()
          .utcOffset(3)
          .format('DD.MM.YYYY')} Сопровод к ИД ${
          law_exec.court_doc_num
        } ${await this.helper.help('executive_typ', law_exec.executive_typ)} ${moment(
          law_exec.court_date,
        )
          .utcOffset(3)
          .format('DD.MM.YYYY')}`;
        if (law_exec.dsc === 'Создается ИП из "Отправка"') {
          law_exec.dsc = new_dsc;
        } else {
          if (!law_exec.dsc) {
            law_exec.dsc = '';
          } else {
            law_exec.dsc += '\r\n';
          }
          law_exec.dsc += new_dsc;
        }
        const law_act = await law_exec.getLawAct();
        if (law_act !== null) {
          if (law_act.typ !== 1) {
            law_act.act_status = 13;
          } else {
            law_act.status = 9;
          }
          await law_act.save({ transaction });
          await transaction.commit();
          await law_act.createLawActProtokol({
            r_user_id: auth.userContact.id,
            typ: 36,
            dsc: `Перевод исполнительного документа на исполнительное производство. ID исп. док-та = ${law_exec.id}`,
          });
        }
        const changes = law_exec.changed() as (keyof Attributes<LawExec>)[];
        if (changes) {
          const transaction = await getContextTransaction(
            this.sequelize,
            auth.userContact.id,
          );
          for (const change of changes) {
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
                  r_user_id: auth.userContact.id,
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
                    r_user_id: auth.userContact.id,
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
                      r_user_id: auth.userContact.id,
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
                      r_user_id: auth.userContact.id,
                      typ: 2,
                      dsc: comment,
                    });
                    break;
                }
                break;
              default:
                const value = `${this.t(change)}. Новое значение: "${await this.helper.help(
                  change,
                  law_exec[change],
                )}". Старое значение: "${await this.helper.help(
                  change,
                  law_exec.previous(change),
                )}".`;
                await law_exec.createLawExecProtokol({
                  r_user_id: auth.userContact.id,
                  typ: 2,
                  dsc: truncator(value),
                });
                break;
            }
          }
          try {
            await law_exec.save({ transaction });
            await transaction.commit();
            return law_exec;
          } catch (error) {
            throw new Error(`${error}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error('Create analog ERROR');
    }
  }
}
