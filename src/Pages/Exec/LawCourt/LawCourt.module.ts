import { LawCourt } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { LawCourtService } from './LawCourt.service';
import { LawCourtController } from './LawCourt.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([LawCourt], 'contact')],
  providers: [LawCourtService],
  controllers: [LawCourtController],
})
export class LawCourtModule {}
