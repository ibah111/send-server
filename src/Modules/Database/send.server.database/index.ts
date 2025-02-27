import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ServerLocalModels } from './server.models';
import { LocalServerDatabaseSeed } from './seed';
import { node } from 'src/main';

@Module({
  imports: [
    SequelizeModule.forRoot({
      host: node === 'prod' ? 'newct.usb.ru' : 'balezin.usb.ru',
      dialect: 'mssql',
      name: 'send',
      username: node === 'prod' ? 'contact' : 'admin',
      password: node === 'prod' ? 'contact' : 'admin1',
      database: 'Send',
      logging: false,
      models: ServerLocalModels,
    }),
  ],
  providers: [LocalServerDatabaseSeed],
})
export class LocalServerDatabase {}
