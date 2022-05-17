import { LawAct, LawExec } from '@contact/models';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { GetCommentController } from './GetComment.controller';
import { GetCommentService } from './GetComment.service';

@Module({
  imports: [SequelizeModule.forFeature([LawExec, LawAct])],
  controllers: [GetCommentController],
  providers: [GetCommentService],
})
export class GetCommentModule {}
