import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { BankRequisitesController } from './BankRequisites.controller';
import BankRequisitesService from './BankRequisites.service';
import { BankRequisits } from '@contact/models';

@Module({
  imports: [SequelizeModule.forFeature([BankRequisits], 'contact')],
  controllers: [BankRequisitesController],
  providers: [BankRequisitesService],
})
export class RequisitesModule {}
