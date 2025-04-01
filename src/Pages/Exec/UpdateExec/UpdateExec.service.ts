import { DocAttach, LawAct, LawCourt, LawExec } from '@contact/models';
import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { Attributes, MIS } from '@sql-tools/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import moment from 'moment';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { Downloader } from 'src/utils/downloader';
import { Helper } from 'src/utils/helper';
import { UpdateExecInput } from './UpdateExec.input';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import getContextTransaction from 'src/utils/getContextTransaction';
import { lastValueFrom } from 'rxjs';
import PortfoliosToRequisitesService from 'src/Pages/PortfoliosToRequisites/PortfoliosToRequisites.service';
import truncator from 'src/utils/truncator';
import { SocketService } from 'src/Modules/Socket/Socket.service';

function transform<T extends keyof Attributes<LawExec> & keyof UpdateExecInput>(
  name: T,
  value?: LawExec[T],
): LawExec[T] {
  if (value) {
    switch (name) {
      case 'load_dt':
      case 'court_date':
      case 'entry_force_dt':
      case 'receipt_recover_dt':
      case 'fssp_date':
        try {
          const date = moment(value);
          if (!date.isValid()) {
            console.error(`Invalid date for ${name}:`, value);
            return null as LawExec[T];
          }
          return date.startOf('day').toDate() as LawExec[T];
        } catch (error) {
          console.error(`Error parsing date for ${name}:`, value, error);
          return null as LawExec[T];
        }
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
    @InjectModel(LawCourt, 'contact')
    private readonly modelLawCourt: typeof LawCourt,
    @InjectModel(LawAct, 'contact')
    private readonly modelLawAct: typeof LawAct,
    private readonly downloader: Downloader,
    private readonly helper: Helper,
    private readonly portfolioToRequisites: PortfoliosToRequisitesService,
    private readonly socketService: SocketService,
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
      const le = await this.ModelLawExec.findByPk(body.id, {
        rejectOnEmpty: new NotFoundException('Такой дело не найдено'),
      });

      const law_act = await this.modelLawAct.findOne({
        where: {
          id: le.r_act_id!,
        },
        rejectOnEmpty: new NotFoundException('Такой law_act не найден'),
      });

      // Начинаем транзакцию
      const transaction = await getContextTransaction(
        this.sequelize,
        auth.userContact.id,
      );

      try {
        // Обновляем law_act
        await law_act.update(
          {
            court_sum: body.court_sum,
            exec_number: body.exec_number,
          },
          { transaction },
        );

        // Обновляем debt_guarantor
        await this.changeDebtGuarantor(
          le,
          body.debt_guarantor,
          auth.userContact.id,
        );

        // Обновляем основные поля
        for (const value of strings) {
          updateData(le, value, transform(value, body[value]));
        }

        le.fssp_doc_num = null;
        le.start_date = null;
        le.deposit_typ = body.person_property ? 1 : null;

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

          // Сохраняем изменения в le
          await le.save({ transaction });

          const la = await le.getLawAct();
          if (la !== null) {
            if (la.typ !== 1) {
              la.act_status = 13;
            } else {
              la.status = 9;
            }
            await la.save({ transaction });

            await la.createLawActProtokol(
              {
                r_user_id: auth.userContact.id,
                typ: 36,
                dsc: `Перевод исполнительного документа на исполнительное производство. ID исп. док-та = ${le.id}`,
              },
              { transaction },
            );
          }

          // Обрабатываем изменения
          const changes = le.changed() as (keyof Attributes<LawExec>)[];
          if (changes) {
            for (const change of changes) {
              switch (change) {
                case 'r_court_id':
                  const r_court_id_value = `${t(change)}. Новое значение: "${await this.helper.help(
                    change,
                    le[change],
                  )}". Старое значение: "${await this.helper.help(
                    change,
                    le.previous(change),
                  )}".`;
                  const comment = truncator(r_court_id_value);
                  await le.createLawExecProtokol(
                    {
                      r_user_id: auth.userContact.id,
                      typ: 2,
                      dsc: comment,
                    },
                    { transaction },
                  );
                  break;
                case 'dsc':
                  const dsc = `${t(change)}. Новое значение: "${await this.helper.help(
                    change,
                    le[change],
                  )}".`;
                  try {
                    const comment = truncator(dsc);
                    await le.createLawExecProtokol(
                      {
                        r_user_id: auth.userContact.id,
                        typ: 2,
                        dsc: comment,
                      },
                      { transaction },
                    );
                  } catch (error) {
                    console.error('Error creating protocol for dsc:', error);
                    throw error;
                  }
                  break;
                case 'state':
                  switch (le.previous(change)) {
                    case 13:
                      await le.createLawExecProtokol(
                        {
                          r_user_id: auth.userContact.id,
                          typ: 30,
                          dsc: truncator(
                            `Изменение статуса с "На исполнении" на "Исполнительное производство"`,
                          ),
                        },
                        { transaction },
                      );
                      break;
                  }
                  break;
              }
            }
          }
        }

        // Коммитим транзакцию
        await transaction.commit();
      } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await transaction.rollback();
        throw error;
      }
    } else {
      return false;
    }
  }
}
