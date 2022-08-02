import { ConstValue, DocAttach, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { SmbModule } from 'src/utils/smb';
import { DocumentsController } from './Documents.controller';
import { DocumentsService } from './Documents.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ConstValue, LawExec, DocAttach, User]),
    SmbModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
