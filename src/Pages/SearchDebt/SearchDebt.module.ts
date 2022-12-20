import { Debt, Dict, Person, Portfolio } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { SearchDebtController } from './SearchDebt.controller';
import { SearchDebtService } from './SearchDebt.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Dict, Person, Portfolio, Debt], 'contact'),
  ],
  controllers: [SearchDebtController],
  providers: [SearchDebtService],
})
export class SearchDebtModule {}
