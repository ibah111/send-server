import { Module } from '@nestjs/common';
import { SequelizeModule } from '@contact/nestjs-sequelize';
import Models from '@contact/models';
@Module({
  imports: [
    SequelizeModule.forRoot({
      host: 'newct.usb.ru',
      dialect: 'mssql',
      username: 'contact',
      password: 'contact',
      database: 'i_collect',
      models: Models,
      logging: false,
    }),
  ],
})
export class ModelsModule {}
