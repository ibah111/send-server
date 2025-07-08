import { Module } from '@nestjs/common';
import { CourtModule } from './Court/Court.module';
import { CreateExecModule } from './Exec/CreateExec/CreateExec.module';
import { DeleteExecModule } from './Exec/DeleteExec/DeleteExec.module';
import { DictModule } from './Dict/Dict.module';
import { LawExecModule } from './Exec/LawExec/LawExec.module';
import { LoginModule } from './Login/Login.module';
import { SearchModule } from './Search/Search.module';
import { SearchDebtModule } from './SearchDebt/SearchDebt.module';
import { UpdateDebtModule } from './UpdateDebt/UpdateDebt.module';
import { SearchLawActModule } from './SearchLawAct/SearchLawAct.module';
import { UpdateExecModule } from './Exec/UpdateExec/UpdateExec.module';
import { DebtCalcModule } from './DebtCalc/DebtCalc.module';
import { DocumentsModule } from './Documents/Documents.module';
import { GetDebtGuarantorModule } from './GetDebtGuarantor/GetDebtGuarantor.module';
import { CreateOrUpdateDebtGuarantorModule } from './CreateOrUpdateDebtGuarantor/CreateOrUpdateDebtGuarantor.module';
import { RestartModule } from './Restart';
import { RequisitesModule } from './Requisites/BankRequisites.module';
import PortfoliosToRequisitesModule from './PortfoliosToRequisites/PortfoliosToRequisites.module';
import CommentsModule from './Comments/Comments.module';
import ExecModule from './Exec/Exec.module';
import { LinksModule } from './Links/Links.module';
import { RejectStatusesModule } from './RejectStatuses/RejectStatuses.module';

@Module({
  imports: [
    LoginModule,
    CourtModule,
    DictModule,
    LawExecModule,
    SearchModule,
    SearchLawActModule,
    UpdateExecModule,
    DeleteExecModule,
    CreateExecModule,
    CommentsModule,
    SearchDebtModule,
    UpdateDebtModule,
    DebtCalcModule,
    DocumentsModule,
    GetDebtGuarantorModule,
    CreateOrUpdateDebtGuarantorModule,
    RestartModule,
    RequisitesModule,
    PortfoliosToRequisitesModule,
    ExecModule,
    LinksModule,
    RejectStatusesModule,
  ],
})
export class PagesModule {}
