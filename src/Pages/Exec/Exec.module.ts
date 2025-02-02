import { LawExec } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ExecController } from './Exec.controller';
import ExecService from './Exec.service';
import { UpdateExecService } from './UpdateExec/UpdateExec.service';

@Module({
  imports: [
    UpdateExecService,
    SequelizeModule.forFeature([LawExec], 'contact'),
  ],
  controllers: [ExecController],
  providers: [ExecService],
})
export default class ExecModule {}
