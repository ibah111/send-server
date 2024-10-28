import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UpdateCommentService from './UpdateComment.service';
import UpdateCommentsInput from './UpdateComments.input';

@ApiTags('Comment')
@Controller('update_comments')
export default class UpdateCommentController {
  private readonly service: UpdateCommentService;

  @Post()
  async updateComment(@Body() input: UpdateCommentsInput) {
    return await this.service.updateComments({
      ...input,
    });
  }
}
