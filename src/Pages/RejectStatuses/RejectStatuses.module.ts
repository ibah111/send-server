import { Module } from '@nestjs/common';
import { RejectStatusesService } from './RejectStatuses.service';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { DebtRejectStatuses } from 'src/Modules/Database/local.database/models/DebtRejectStatuses.model';
import LawActRejectStatuses from 'src/Modules/Database/local.database/models/LawActRejectStatuses.model';
import { RejectStatusesController } from './RejectStatuses.controller';
import { Dict } from '@contact/models';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [DebtRejectStatuses, LawActRejectStatuses],
      'local',
    ),
    SequelizeModule.forFeature([Dict], 'contact'),
  ],
  controllers: [RejectStatusesController],
  providers: [RejectStatusesService],
})
export class RejectStatusesModule {}
