import { LawExec } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from '@sql-tools/sequelize';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment-timezone';
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
  ) {}
  @Cron('*/30 * * * * *')
  async removeNotCreated() {
    const acts = await this.modelLawExec.findAll({
      where: {
        state: 5,
        dsc: 'Создается ИП из "Отправка"',
        load_dt: { [Op.lte]: moment().add(-30, 'm').toDate() },
      },
    });
    for (const act of acts) {
      for (const protokol of await act.$get('LawExecProtokols')) {
        await protokol.destroy();
      }
      for (const log of await act.$get('LawExecColumnLogs')) {
        await log.destroy();
      }
      await (await act.$get('LawExecPersonLink'))?.destroy();
      await act.destroy();
    }
  }
}
