import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import Models from '@contact/models';
@Module({
  imports: [
    SequelizeModule.forRoot({
      host: 'newct.usb.ru',
      dialect: 'mssql',
      username: 'contact',
      password: 'contact',
      database: 'i_collect',
      name: 'contact',
      models: Models,
      logging: false,
    }),
  ],
})
export class ContactDatabase {}
