import { Address, Debt, Dict, LawAct, Person, Portfolio } from "@contact/models";
import { SequelizeModule } from "@contact/nestjs-sequelize";
import { Module } from "@nestjs/common";
import { SearchLawActController } from "./SearchLawAct.controller";
import { SearchLawActService } from "./SearchLawAct.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      LawAct,
      Dict,
      Address,
      Person,
      Portfolio,
      Debt,
    ]),
  ],
  controllers: [SearchLawActController],
  providers: [SearchLawActService],
})
export class SearchLawActModule {}
