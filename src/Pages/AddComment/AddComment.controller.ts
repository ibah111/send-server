import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  Auth,
  AuthGuard,
  AuthUserSuccess,
} from 'src/Modules/Guards/auth.guard';
import { AddCommentInput } from './AddComment.input';
import { AddCommentService } from './AddComment.service';

@Controller('add_comment')
@UseGuards(AuthGuard)
export class AddCommentController {
  constructor(private readonly addCommentService: AddCommentService) {}
  @Post()
  async AddComment(
    @Body() body: AddCommentInput,
    @Auth() user: AuthUserSuccess,
  ) {
    return await this.addCommentService.AddComment(body, user);
  }
}
