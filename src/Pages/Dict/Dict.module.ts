import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DictController } from './Dict.controller';
import { DictService } from './Dict.service';
import { Dict, DictName } from '@contact/models';

@Module({
  imports: [SequelizeModule.forFeature([Dict, DictName], 'contact')],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
