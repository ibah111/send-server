import { Module } from '@nestjs/common';
import { ModelsModule } from './models';
import { ModulesModule } from './Modules/Modules.module';
import { PagesModule } from './pages';
import { SmbModule } from './utils/smb';

@Module({
  imports: [ModelsModule, SmbModule, PagesModule, ModulesModule],
})
export class AppModule {}
