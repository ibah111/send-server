import { Address, DebtGuarantor } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { GetDebtGuarantorController } from './GetDebtGuarantor.controller';
import { GetDebtGuarantorService } from './GetDebtGuarantor.service';

@Module({
  imports: [SequelizeModule.forFeature([DebtGuarantor, Address], 'contact')],
  controllers: [GetDebtGuarantorController],
  providers: [GetDebtGuarantorService],
})
export class GetDebtGuarantorModule {}
