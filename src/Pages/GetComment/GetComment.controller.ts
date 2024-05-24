import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { GetCommentInput } from './GetComment.input';
import { GetCommentService } from './GetComment.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Comment')
@Controller('get_comment')
@UseGuards(AuthGuard)
export class GetCommentController {
  constructor(private readonly getCommentService: GetCommentService) {}
  @Post()
  @HttpCode(200)
  async GetComment(@Body() body: GetCommentInput) {
    return await this.getCommentService.GetComment(body);
  }
}
