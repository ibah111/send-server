import { LawAct, LawExec, User } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { AddCommentController } from './AddComment.controller';
import { AddCommentService } from './AddComment.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec, LawAct], 'contact')],
  controllers: [AddCommentController],
  providers: [AddCommentService],
})
export class AddCommentModule {}
