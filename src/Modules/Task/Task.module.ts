import { LawExec } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { TaskService } from './Task.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec])],
  providers: [TaskService],
})
export class TaskModule {}
