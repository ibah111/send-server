import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FastifyFileInterceptor } from 'nest-fastify-multer';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { DocumentsInput, DocumentsRemoveInput } from './Documents.input';
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
  @FastifyFileInterceptor('file', {})
  @Post('upload/:id')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Auth() auth: AuthResult,
  ) {
    return await this.documentsService.upload(file, id, auth);
  }
  @Post('remove')
  async remove(@Body() body: DocumentsRemoveInput, @Auth() auth: AuthResult) {
    return this.documentsService.remove(body.id, auth);
  }
}
