import { DocAttach, LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DownloaderModule } from 'src/utils/downloader';
import { HelperModule } from 'src/utils/helper';
import { UpdateExecController } from './UpdateExec.controller';
import { UpdateExecService } from './UpdateExec.service';
import PortfoliosToRequisitesService from 'src/Pages/PortfoliosToRequisites/PortfoliosToRequisites.service';

@Module({
  imports: [
    PortfoliosToRequisitesService,
    DownloaderModule,
    HelperModule,
    SequelizeModule.forFeature([LawExec, DocAttach], 'contact'),
  ],
  controllers: [UpdateExecController],
  providers: [UpdateExecService],
})
export class UpdateExecModule {}
