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
    debtRejectStatuses: number[];
    lawActRejectStatuses: string[];
  }> {
    try {
      const debtRejectStatuses = await this.modelDebtRejectStatuses.findAll();
      const lawActRejectStatuses =
        await this.modelLawActRejectStatuses.findAll();

      const response: {
        debtRejectStatuses: number[];
        lawActRejectStatuses: string[];
      } = {
        debtRejectStatuses: debtRejectStatuses.map((debt) => debt.reject_id),
        lawActRejectStatuses: lawActRejectStatuses.map(
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
    try {
      const dict = await this.modelDict.findOne({
        where: {
          code: reject_id,
        },
      });
      if (!dict) {
        throw new BadRequestException('Статус отказа не найден');
      }
      const debtRejectStatus = await this.modelDebtRejectStatuses.create({
        reject_id: dict.id,
      });

      return debtRejectStatus;
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
    try {
      const lawActRejectStatus = await this.modelLawActRejectStatuses.create({
        reject_name,
      });

      return lawActRejectStatus;
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
}
