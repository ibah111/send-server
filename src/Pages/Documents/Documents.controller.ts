import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FastifyFileInterceptor } from 'nest-fastify-multer';
import {
  Auth,
  AuthGuard,
  AuthUserSuccess,
} from 'src/Modules/Guards/auth.guard';
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
    @Auth() user: AuthUserSuccess,
  ) {
    return await this.documentsService.upload(file, id, user);
  }
  @Post('remove')
  async remove(
    @Body() body: DocumentsRemoveInput,
    @Auth() user: AuthUserSuccess,
  ) {
    return this.documentsService.remove(body.id, user);
  }
}
