import { Module } from '@nestjs/common';
import UpdateCommentController from './UpdateComment.controller';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { LawAct, LawExec } from '@contact/models';

@Module({
  controllers: [UpdateCommentController],
  providers: [UpdateCommentController],
  imports: [SequelizeModule.forFeature([LawExec, LawAct], 'contact')],
})
export default class UpdateCommentModule {}
