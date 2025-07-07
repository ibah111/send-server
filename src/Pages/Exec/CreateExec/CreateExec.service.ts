import { Debt, LawAct } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { CreateExecInput } from './CreateExec.input';
@Injectable()
export class CreateExecService {
  private readonly service_tag = this.CreateExec.name;
  private readonly logger = new Logger(CreateExecService.name);

  constructor(
    @InjectModel(LawAct, 'contact')
    private ModelLawAct: typeof LawAct,
    @InjectModel(Debt, 'contact')
    private ModelDebt: typeof Debt,
  ) {}

  async CreateExec(
    body: CreateExecInput,
    auth: AuthResult,
  ): Promise<boolean | number> {
    this.logger.log('CreateExec');
    console.log('input body: ', body);
    const tag = `${this.service_tag}-${this.CreateExec.name}`;

    if (auth.userContact !== null) {
      try {
        const la = await this.ModelLawAct.findByPk(Number(body.id));

        if (la === null) {
          this.logger.error(`LawAct не найден`, { tag });
          throw new NotFoundException('LawAct не найден');
        }

        const debt = await la.getDebt();

        if (!debt) {
          this.logger.error(`Долг не найден`, { tag });
          throw new NotFoundException('Долг не найден');
        }

        const le = await la.createLawExec({
          ...body.old,
          r_person_id: la.r_person_id,
          r_debt_id: la.r_debt_id,
          r_portfolio_id: la.r_portfolio_id,
          state: 5,
          DELIVERY_TYP: 3,
          contract: debt.contract,
          currency: 1,
          total_sum: 0,
          name: debt.name,
          dsc: 'Создается ИП из "Отправка"',
        });
        const la_link = await la.getLawActPersonLink();
        await le.createLawExecPersonLink({
          PERSON_ID: la_link.PERSON_ID,
          PERSON_ROLE: la_link.PERSON_ROLE,
          R_LAW_EXEC_ID: le.id,
        });
        await le.createLawExecProtokol({
          r_user_id: auth.userContact.id,
          typ: 1,
          dsc: `Создание ИД из "Отправки" со значениями: Статус - (5) Аннулировано, Тип доставки - (3) Курьером, Договор - ${
            debt.contract
          }`,
        });
        this.logger.log(`ИП создан`);
        console.log('created', { tag, id: le.id });
        return le.id;
      } catch (error) {
        this.logger.error(`Ошибка при создании ИП`, { tag, error });
        throw new InternalServerErrorException('Ошибка при создании ИП');
      }
    } else {
      return false;
    }
  }
}
