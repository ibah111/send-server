import { Module } from '@nestjs/common';
import { AddCommentModule } from './AddComment/AddComment.module';
import { CourtModule } from './Court/Court.module';
import { CreateExecModule } from './CreateExec/CreateExec.module';
import { DeleteExecModule } from './DeleteExec/DeleteExec.module';
import { DictModule } from './Dict/Dict.module';
import { GetCommentModule } from './GetComment/GetComment.module';
import { LawExecModule } from './LawExec/LawExec.module';
import { LoginModule } from './Login/Login.module';
import { SearchModule } from './Search/Search.module';
import { SearchDebtModule } from './SearchDebt/SearchDebt.module';
import { UpdateDebtModule } from './UpdateDebt/UpdateDebt.module';
import { SearchLawActModule } from './SearchLawAct/SearchLawAct.module';
import { UpdateExecModule } from './UpdateExec/UpdateExec.module';
import { DebtCalcModule } from './DebtCalc/DebtCalc.module';
import { DocumentsModule } from './Documents/Documents.module';
import { GetDebtGuarantorModule } from './GetDebtGuarantor/GetDebtGuarantor.module';
import { CreateOrUpdateDebtGuarantorModule } from './CreateOrUpdateDebtGuarantor/CreateOrUpdateDebtGuarantor.module';

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
    SearchDebtModule,
    UpdateDebtModule,
    DebtCalcModule,
    DocumentsModule,
    GetDebtGuarantorModule,
    CreateOrUpdateDebtGuarantorModule,
  ],
})
export class PagesModule {}
