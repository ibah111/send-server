import { DocAttach, LawAct, LawCourt, LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DownloaderModule } from 'src/utils/downloader';
import { HelperModule } from 'src/utils/helper';
import { UpdateExecController } from './UpdateExec.controller';
import { UpdateExecService } from './UpdateExec.service';
import PortfoliosToRequisitesModule from 'src/Pages/PortfoliosToRequisites/PortfoliosToRequisites.module';

@Module({
  imports: [
    PortfoliosToRequisitesModule,
    DownloaderModule,
    HelperModule,
    SequelizeModule.forFeature(
      [LawExec, DocAttach, LawCourt, LawAct],
      'contact',
    ),
  ],
  controllers: [UpdateExecController],
  providers: [UpdateExecService],
  exports: [UpdateExecService],
})
export class UpdateExecModule {}
