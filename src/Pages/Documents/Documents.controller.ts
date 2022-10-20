import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { DocumentsInput } from './Documents.input';
import { DocumentsService } from './Documents.service';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @Post('get')
  async get(@Body() body: DocumentsInput) {
    if (body.id) {
      return await this.documentsService.get(body.id);
    }
    if (body.law_exec_id) {
      return await this.documentsService.getAll(body.law_exec_id);
    }
  }
}
