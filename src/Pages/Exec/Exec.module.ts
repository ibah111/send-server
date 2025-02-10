import { Dict, LawAct, LawCourt, LawExec } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ExecController } from './Exec.controller';
import ExecService from './Exec.service';
import { HelperModule } from 'src/utils/helper';
import { SocketModule } from 'src/Modules/Socket/Socket.module';

@Module({
  imports: [
    HelperModule,
    SocketModule,
    SequelizeModule.forFeature([LawExec, LawAct, Dict, LawCourt], 'contact'),
  ],
  controllers: [ExecController],
  providers: [ExecService],
})
export default class ExecModule {}
