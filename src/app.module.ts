import { Module } from '@nestjs/common';
import { ModulesModule } from './Modules/Modules.module';
import { PagesModule } from './Pages';

@Module({
  imports: [PagesModule, ModulesModule],
})
export class AppModule {}
