import { LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DeleteExecController } from './DeleteExec.controller';
import { DeleteExecService } from './DeleteExec.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec], 'contact')],
  controllers: [DeleteExecController],
  providers: [DeleteExecService],
})
export class DeleteExecModule {}
