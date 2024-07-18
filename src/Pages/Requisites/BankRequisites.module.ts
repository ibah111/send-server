import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';

@Module({
  imports: [SequelizeModule.forFeature([], '')],
  controllers: [],
  providers: [],
})
export class RequisitesModule {}
