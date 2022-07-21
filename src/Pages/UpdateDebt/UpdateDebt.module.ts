import { Debt, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { UpdateDebtController } from './UpdateDebt.controller';
import { UpdateDebtService } from './UpdateDebt.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Debt, LawExec])],
  controllers: [UpdateDebtController],
  providers: [UpdateDebtService],
})
export class UpdateDebtModule {}
