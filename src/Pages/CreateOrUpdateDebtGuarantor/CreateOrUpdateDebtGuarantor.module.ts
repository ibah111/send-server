import { Address, DebtGuarantor } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { CreateOrUpdateDebtGuarantorController } from './CreateOrUpdateDebtGuarantor.controller';
import { CreateOrUpdateDebtGuarantorService } from './CreateOrUpdateDebtGuarantor.service';

@Module({
  imports: [SequelizeModule.forFeature([DebtGuarantor, Address], 'contact')],
  controllers: [CreateOrUpdateDebtGuarantorController],
  providers: [CreateOrUpdateDebtGuarantorService],
})
export class CreateOrUpdateDebtGuarantorModule {}
