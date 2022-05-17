import { Module } from "@nestjs/common";
import { ModelsModule } from "./models";
import { PagesModule } from "./pages";
import { SmbModule } from "./utils/smb";

@Module({
  imports: [ModelsModule, SmbModule, PagesModule],
})
export class AppModule {}
