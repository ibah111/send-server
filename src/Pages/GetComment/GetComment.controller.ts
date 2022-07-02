import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { GetCommentService } from './GetComment.service';

@Controller('get_comment')
@UseGuards(AuthGuard)
export class GetCommentController {
  constructor(private readonly getCommentService: GetCommentService) {}
  @Post()
  @HttpCode(200)
  async GetComment(@Body() body: any) {
    return await this.getCommentService.GetComment(body);
  }
}
