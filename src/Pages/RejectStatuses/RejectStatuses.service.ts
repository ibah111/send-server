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
import CacheService from 'src/Modules/Cache/Cache.service';
import { CacheEnums } from 'src/utils/enums';
import { GetAllResponse } from './interfaces/get-all-response';
import { endPerfomance } from 'src/utils/endPerfomance';

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
    private readonly cacheService: CacheService,
  ) {}

  async resetCacheRejectStatuses() {
    const newRejectStatuses = await this.getAllFromDB();
    this.cacheService.set({
      key: CacheEnums.REJECT_STATUSES,
      value: newRejectStatuses,
      ttl: 60000,
    });
  }

  async getAll() {
    const begin = performance.now();
    const cachedData = await this.cacheService.get({
      key: CacheEnums.REJECT_STATUSES,
    });
    if (cachedData) {
      endPerfomance(begin, 'From Cache'.cyan);
      return cachedData as GetAllResponse;
    }
    this.logger.log('Cache not found, getting from database');
    const response = await this.getAllFromDB();
    endPerfomance(begin, 'From DB'.blue);
    return response;
  }

  async getAllFromDB(): Promise<GetAllResponse> {
    try {
      const debtRejectStatuses = await this.modelDebtRejectStatuses.findAll();
      const lawActRejectStatuses =
        await this.modelLawActRejectStatuses.findAll();

      const attributes = ['id', 'code', 'name'];

      const dict_for_debt = await this.modelDict.findAll({
        where: {
          parent_id: 6,
          code: {
            [Op.in]: [...debtRejectStatuses.map((debt) => debt.reject_id)],
          },
        },
        attributes,
      });

      const dict_for_law_act = await this.modelDict.findAll({
        where: {
          parent_id: 18,
          name: {
            [Op.in]: [...lawActRejectStatuses.map((law) => law.reject_name)],
          },
        },
        attributes,
      });

      const response: GetAllResponse = {
        debt_reject_statuses: debtRejectStatuses.map((debt) => debt.reject_id),
        dict_for_debt,
        law_act_reject_statuses: lawActRejectStatuses.map(
          (law) => law.reject_name,
        ),
        dict_for_law_act,
      };

      this.cacheService.set({
        key: CacheEnums.REJECT_STATUSES,
        value: response as GetAllResponse,
        ttl: 60000,
      });

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

      this.resetCacheRejectStatuses();
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

      this.resetCacheRejectStatuses();
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
    const debt_reject_status = await this.modelDebtRejectStatuses.destroy({
      where: { reject_id },
    });
    this.resetCacheRejectStatuses();
    return debt_reject_status;
  }

  async deleteLawActRejectStatus(name: string) {
    const law_act_reject_status = await this.modelLawActRejectStatuses.destroy({
      where: { reject_name: name },
    });
    this.resetCacheRejectStatuses();
    return law_act_reject_status;
  }
}
