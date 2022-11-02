import { Debt, LawExec, Person, Portfolio } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { LawExecController } from './LawExec.controller';
import { LawExecService } from './LawExec.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec, Person, Debt, Portfolio])],
  controllers: [LawExecController],
  providers: [LawExecService],
})
export class LawExecModule {}
