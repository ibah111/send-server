import { Module } from '@nestjs/common';
import LinksController from './Links.controller';
import LinksService from './Links.service';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Link } from 'src/Modules/Database/send.server.database/server.models/Link.model';

@Module({
  imports: [SequelizeModule.forFeature([Link], 'send')],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
