import { LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DeleteExecController } from './DeleteExec.controller';
import { DeleteExecService } from './DeleteExec.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec], 'contact')],
  controllers: [DeleteExecController],
  providers: [DeleteExecService],
})
export class DeleteExecModule {}
