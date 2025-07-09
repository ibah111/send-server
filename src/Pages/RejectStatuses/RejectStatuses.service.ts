import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DebtRejectStatuses } from 'src/Modules/Database/local.database/models/DebtRejectStatuses.model';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import LawActRejectStatuses from 'src/Modules/Database/local.database/models/LawActRejectStatuses.model';
import { Dict } from '@contact/models';
import { Op } from '@sql-tools/sequelize';

@Injectable()
export class RejectStatusesService {
  private readonly logger = new Logger(RejectStatusesService.name);

  constructor(
    @InjectModel(DebtRejectStatuses, 'local')
    private readonly modelDebtRejectStatuses: typeof DebtRejectStatuses,
    @InjectModel(LawActRejectStatuses, 'local')
    private readonly modelLawActRejectStatuses: typeof LawActRejectStatuses,

    @InjectModel(Dict, 'contact')
    private readonly modelDict: typeof Dict,
  ) {}

  async getAll(): Promise<{
    debt_reject_statuses: number[];
    law_act_reject_statuses: string[];
  }> {
    try {
      const debtRejectStatuses = await this.modelDebtRejectStatuses.findAll();
      const lawActRejectStatuses =
        await this.modelLawActRejectStatuses.findAll();

      const response: {
        debt_reject_statuses: number[];
        law_act_reject_statuses: string[];
      } = {
        debt_reject_statuses: debtRejectStatuses.map((debt) => debt.reject_id),
        law_act_reject_statuses: lawActRejectStatuses.map(
          (law) => law.reject_name,
        ),
      };

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addDebtRejectStatus(reject_id: number): Promise<DebtRejectStatuses> {
    const DEBT_DICT_CODE = 6; // Код словаря для долга
    try {
      const dict = await this.modelDict.findOne({
        where: {
          [Op.and]: [{ parent_id: DEBT_DICT_CODE }, { code: reject_id }],
        },
      });
      if (!dict) {
        throw new BadRequestException('Статус отказа не найден');
      }
      const element = await this.modelDebtRejectStatuses.findOne({
        where: {
          reject_id,
        },
      });
      if (element) {
        throw new BadRequestException(
          `Статус отказа debt - "${dict.name}" уже существует`,
        );
      }
      const debt_reject_status = await this.modelDebtRejectStatuses.create({
        reject_id: dict.code,
      });

      return debt_reject_status;
    } catch (error) {
      this.logger.error(error);
      const err_message =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new InternalServerErrorException(
        'Ошибка при добавлении статуса отказа',
        err_message,
      );
    }
  }

  async addLawActRejectStatus(
    reject_name: string,
  ): Promise<LawActRejectStatuses> {
    const LAW_ACT_DICT_CODE = 18; // Код словаря для законаS
    try {
      const dict = await this.modelDict.findOne({
        where: {
          [Op.and]: [{ parent_id: LAW_ACT_DICT_CODE }, { name: reject_name }],
        },
      });
      if (!dict) {
        throw new BadRequestException('Статус отказа law_act не найден');
      }
      const element = await this.modelLawActRejectStatuses.findOne({
        where: {
          reject_name,
        },
      });
      if (element) {
        throw new BadRequestException(
          `Статус отказа law_act - "${dict.name}" уже существует`,
        );
      }
      const law_act_reject_status = await this.modelLawActRejectStatuses.create(
        {
          reject_name,
        },
      );

      return law_act_reject_status;
    } catch (error) {
      this.logger.error(error);
      const err_message =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new InternalServerErrorException(
        'Ошибка при добавлении статуса отказа',
        err_message,
      );
    }
  }

  async deleteDebtRejectStatus(reject_id: number) {
    return await this.modelDebtRejectStatuses.destroy({
      where: { reject_id },
    });
  }

  async deleteLawActRejectStatus(name: string) {
    return await this.modelLawActRejectStatuses.destroy({
      where: { reject_name: name },
    });
  }
}
