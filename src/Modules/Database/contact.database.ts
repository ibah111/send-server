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
      database: process.env.NODE_ENV === 'prod' ? 'i_collect' : 'i_collect3',
      name: 'contact',
      models: Models,
      logging: false,
    }),
  ],
})
export class ContactDatabase {}
