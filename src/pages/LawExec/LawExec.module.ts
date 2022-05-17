import { Debt, LawExec, Person } from "@contact/models";
import { SequelizeModule } from "@contact/nestjs-sequelize";
import { Module } from "@nestjs/common";
import { LawExecController } from "./LawExec.controller";
import { LawExecService } from "./LawExec.service";

@Module({
  imports: [SequelizeModule.forFeature([LawExec, Person, Debt])],
  controllers: [LawExecController],
  providers: [LawExecService],
})
export class LawExecModule {}
