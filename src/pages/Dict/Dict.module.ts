import { Dict } from "@contact/models";
import { SequelizeModule } from "@contact/nestjs-sequelize";
import { Module } from "@nestjs/common";
import { DictController } from "./Dict.controller";
import { DictService } from "./Dict.service";

@Module({
  imports: [SequelizeModule.forFeature([Dict])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
