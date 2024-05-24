import { ConstValue, DocAttach, LawAct, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DownloaderModule } from 'src/utils/downloader';
import { DocumentsController } from './Documents.controller';
import { DocumentsService } from './Documents.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [ConstValue, LawExec, LawAct, DocAttach, User],
      'contact',
    ),
    DownloaderModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
