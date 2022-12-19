import { DocAttach, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DownloaderModule } from 'src/utils/downloader';
import { HelperModule } from 'src/utils/helper';
import { UpdateExecController } from './UpdateExec.controller';
import { UpdateExecService } from './UpdateExec.service';

@Module({
  imports: [
    DownloaderModule,
    HelperModule,
    SequelizeModule.forFeature([LawExec, DocAttach], 'contact'),
  ],
  controllers: [UpdateExecController],
  providers: [UpdateExecService],
})
export class UpdateExecModule {}
