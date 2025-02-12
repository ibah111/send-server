/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dict, LawAct, LawCourt, LawExec } from '@contact/models';
import { Injectable, NotFoundException } from '@nestjs/common';
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
import { node } from 'src/main';

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
    @InjectModel(LawCourt, 'contact')
    private readonly modelLawCourt: typeof LawCourt,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(body: any, auth: AuthResult) {
    node === 'prod' ? () => {} : console.log(body);
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
        const law_exec = await this.modelLawExec.findOne({
          where: {
            id: body.id,
          },
          rejectOnEmpty: true,
        });
        await this.changeDebtGuarantor(
          law_exec,
          body.debt_guarantor,
          auth.userContact!.id,
        );
        await this.modelLawAct
          .findOne({
            where: {
              id: law_exec.r_act_id!,
            },
            rejectOnEmpty: true,
          })
          .then((law_act) =>
            law_act
              ?.update({
                court_sum: body.court_sum,
                exec_number: body.exec_number,
              })
              .then(async () => {
                node === 'prod'
                  ? () => {}
                  : console.log(
                      `law_act_id: ${law_act.id} has been updated to ${body.court_sum}`,
                    );
                await law_act.createLawActProtokol({
                  typ: 2,
                  r_user_id: auth.userContact!.id,
                  dsc: `Пред. сумма: "${law_act.previous().court_sum}" изменена на "${body.court_sum}"`,
                });
                await law_act.createLawActProtokol({
                  typ: 2,
                  r_user_id: auth.userContact!.id,
                  dsc: `Номер документа (приказа/иска) изменён с "${law_act.previous().exec_number}" на "${body.exec_number}"`,
                });
                return true;
              }),
          );
        return law_exec
          .update(
            {
              ...body,
              // court_name: law_court!.name,
              state,
              dsc,
            },
            {
              where: {
                id: body.id,
              },
            },
          )
          .then(async () => {
            const changes = law_exec.changed() as string[];
            if (changes)
              return await this.protokolChanges(changes, law_exec, auth).then(
                () => true,
              );
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async save(body: any, auth: AuthResult) {
    const r_user_id = auth.userContact!.id;
    const response = {
      law_act_response: false,
      law_exec_response: false,
    };
    try {
      /**
       * Law exec changes
       */
      const law_exec = await this.modelLawExec.findOne({
        where: {
          id: body.id,
        },
        rejectOnEmpty: new NotFoundException('Law exec not found'),
      });
      const old_data_values = law_exec.dataValues;
      law_exec.update({
        ...body,
      });
      const new_data_values = await this.modelLawExec.findOne({
        where: {
          id: body.id,
        },
        rejectOnEmpty: true,
      });

      const changes = {};
      Object.keys(new_data_values.dataValues).forEach((key) => {
        //@ts-ignore
        const oldValue = old_data_values[key];
        //@ts-ignore
        const newValue = new_data_values.dataValues[key];

        if (oldValue !== newValue) {
          //@ts-ignore
          changes[key] = { old: oldValue, new: newValue };
        }
      });
      if (changes) {
        response.law_exec_response = true;
        Object.entries(changes).forEach(
          //@ts-ignore
          async ([field, { old, new: newValue }]) => {
            const dsc = `Поле "${this.t(field)}" было изменено с: "${old}" => "${newValue}" `;
            console.log(dsc);
            await law_exec.createLawExecProtokol({
              r_user_id,
              typ: 2,
              dsc,
            });
          },
        );
      }
      /**
       * Law act changes
       */
      const law_act = await this.modelLawAct.findOne({
        where: {
          id: law_exec.r_act_id!,
        },
        rejectOnEmpty: new NotFoundException('Law act not found'),
      });
      law_act.exec_number = body.exec_number;
      law_act.court_sum = body.court_sum;
      console.log('law_act prev', law_act.previous());

      const prevs = law_act.previous();
      if (prevs.exec_number) {
        const dsc = `Номер дела в суде был изменён с "${prevs.exec_number}" => "${body.exec_number}"`;
        await law_act.createLawActProtokol({
          r_user_id,
          dsc,
          typ: 2,
        });
      }
      if (prevs.court_sum) {
        const dsc = `Сумма по решению суда изменена с "${prevs.court_sum}" => "${body.court_sum}"`;
        await law_act.createLawActProtokol({
          r_user_id,
          dsc,
          typ: 2,
        });
      }

      await law_act.save().then(() => {
        response.law_act_response = true;
      });
      console.log('responce: ', response);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`);
    }
  }
}
