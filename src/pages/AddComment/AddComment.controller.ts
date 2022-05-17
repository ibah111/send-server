import { Body, Controller, Post } from '@nestjs/common';
import { Auth, AuthUserSuccess } from 'src/utils/auth.guard';
import { AddCommentService } from './AddComment.service';

@Controller('add_comment')
export class AddCommentController {
  constructor(private readonly addCommentService: AddCommentService) {}
  @Post()
  async AddComment(@Body() body: any, @Auth() user: AuthUserSuccess) {
    return await this.addCommentService.AddComment(body, user);
  }
}
