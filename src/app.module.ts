import { Module } from '@nestjs/common';
import { ModelsModule } from './models';
import { ModulesModule } from './Modules/Modules.module';
import { PagesModule } from './Pages';

@Module({
  imports: [ModelsModule, PagesModule, ModulesModule],
})
export class AppModule {}
