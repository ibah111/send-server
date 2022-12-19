import { LawAct, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { CreateExecController } from './CreateExec.controller';
import { CreateExecService } from './CreateExec.service';

@Module({
  imports: [SequelizeModule.forFeature([LawAct], 'contact')],
  providers: [CreateExecService],
  controllers: [CreateExecController],
})
export class CreateExecModule {}
