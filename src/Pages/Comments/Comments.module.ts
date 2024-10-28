import { Module } from '@nestjs/common';
import { AddCommentModule } from './AddComment/AddComment.module';
import UpdateCommentModule from './UpdateComment/UpdateComment.module';
import { GetCommentModule } from './GetComment/GetComment.module';

@Module({
  imports: [AddCommentModule, UpdateCommentModule, GetCommentModule],
})
export default class CommentsModule {}
