import {
  Address,
  Debt,
  DebtGuarantor,
  Dict,
  LawAct,
  LawActPersonLink,
  Person,
  Portfolio,
} from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { SearchLawActController } from './SearchLawAct.controller';
import { SearchLawActService } from './SearchLawAct.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [
        LawAct,
        Dict,
        Address,
        Person,
        Portfolio,
        Debt,
        LawActPersonLink,
        DebtGuarantor,
      ],
      'contact',
    ),
  ],
  controllers: [SearchLawActController],
  providers: [SearchLawActService],
})
export class SearchLawActModule {}
