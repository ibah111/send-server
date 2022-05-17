import { LawCourt } from "@contact/models";
import { SequelizeModule } from "@contact/nestjs-sequelize";
import { Module } from "@nestjs/common";
import { CourtController } from "./Court.controller";
import { CourtService } from "./Court.service";

@Module({
  imports: [SequelizeModule.forFeature([LawCourt])],
  controllers: [CourtController],
  providers: [CourtService],
})
export class CourtModule {}
