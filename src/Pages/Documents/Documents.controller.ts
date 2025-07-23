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
  UseInterceptors,
} from '@nestjs/common';
import { FastifyFileInterceptor } from 'nest-fastify-multer';
import { map } from 'rxjs';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import {
  LawExecDocumentsInput,
  DocumentsRemoveInput,
  LawActDocumentsInput,
} from './Documents.input';
import { DocumentsService } from './Documents.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/utils/decorators/public.decorator';

@ApiBasicAuth()
@UseGuards(AuthGuard)
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Public()
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

  @Post('getLawExec')
  getLawExecAttachs(@Body() body: LawExecDocumentsInput) {
    if (body.id) {
      return this.documentsService.get(body.id);
    }
    if (body.law_exec_id) {
      const LawExec = this.documentsService.getAllLawExecDocAttachs(
        body.law_exec_id,
      );
      return LawExec;
    }
  }

  @Post('getLawAct')
  getLawActAttachs(@Body() body: LawActDocumentsInput) {
    const LawAct = this.documentsService.getAllLawActDocAttachs(
      body.law_act_id,
    );
    return LawAct;
  }

  @FastifyFileInterceptor('file', {})
  @Post('upload/:id')
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Auth() auth: AuthResult,
  ) {
    return this.documentsService.upload(file, id, auth);
  }

  @Post('remove')
  remove(@Body() body: DocumentsRemoveInput, @Auth() auth: AuthResult) {
    return this.documentsService.remove(body.id, auth);
  }
}
