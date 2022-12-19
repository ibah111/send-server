import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DownloaderModule } from 'src/utils/downloader';
import { DocumentsController } from './Documents.controller';
import { DocumentsService } from './Documents.service';
import config from '../../config/smb.json';
import { SmbModule } from '@tools/nestjs-smb2';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [ConstValue, LawExec, DocAttach, User],
      'contact',
    ),
    SmbModule.register(config),
    DownloaderModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
