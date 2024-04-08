import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';
import { FastifyFileInterceptor } from 'nest-fastify-multer';
import { map } from 'rxjs';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import { DocumentsInput, DocumentsRemoveInput } from './Documents.input';
import { DocumentsService } from './Documents.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}
  @UseGuards(AuthGuard)
  @Post('get')
  get(@Body() body: DocumentsInput) {
    if (body.id) {
      return this.documentsService.get(body.id);
    }
    if (body.law_exec_id) {
      return this.documentsService.getAll(body.law_exec_id);
    }
  }
  @Get(':id')
  getFile(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.get(id).pipe(
      map(
        (doc) =>
          new StreamableFile(doc.file, {
            type: doc.mime,
            disposition: doc.disposition,
          }),
      ),
    );
  }
  @UseGuards(AuthGuard)
  @FastifyFileInterceptor('file', {})
  @Post('upload/:id')
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Auth() auth: AuthResult,
  ) {
    return this.documentsService.upload(file, id, auth);
  }
  @UseGuards(AuthGuard)
  @Post('remove')
  remove(@Body() body: DocumentsRemoveInput, @Auth() auth: AuthResult) {
    return this.documentsService.remove(body.id, auth);
  }
}
