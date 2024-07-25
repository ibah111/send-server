import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ServerLocalModels } from './server.models';
import { LocalServerDatabaseSeed } from './seed';

@Module({
  imports: [
    SequelizeModule.forRoot({
      host: 'newct.usb.ru',
      dialect: 'mssql',
      name: 'send',
      username: 'contact',
      password: 'contact',
      database: 'Send',
      logging: false,
      models: ServerLocalModels,
    }),
  ],
  providers: [LocalServerDatabaseSeed],
})
export class LocalServerDatabase {}
