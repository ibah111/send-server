import { Module } from '@nestjs/common';
import { AddCommentModule } from './AddComment/AddComment.module';
import { CourtModule } from './Court/Court.module';
import { CreateExecModule } from './CreateExec/CreateExec.module';
import { DeleteExecModule } from './DeleteExec/DeleteExec.module';
import { DictModule } from './Dict/Dict.module';
import { GetCommentModule } from './GetComment/getComment.module';
import { LawExecModule } from './LawExec/LawExec.module';
import { LoginModule } from './Login/Login.module';
import { SearchModule } from './Search/Search.module';
import { SearchLawActModule } from './SearchLawAct/SearchLawAct.module';
import { UpdateExecModule } from './UpdateExec/UpdateExec.module';

@Module({
  imports: [
    LoginModule,
    CourtModule,
    DictModule,
    LawExecModule,
    SearchModule,
    SearchLawActModule,
    UpdateExecModule,
    GetCommentModule,
    DeleteExecModule,
    CreateExecModule,
    AddCommentModule,
  ],
})
export class PagesModule {}
