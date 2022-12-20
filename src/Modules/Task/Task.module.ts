import { LawExec } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { TaskService } from './Task.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec], 'contact')],
  providers: [TaskService],
})
export class TaskModule {}
