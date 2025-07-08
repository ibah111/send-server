import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { LocalSeed } from './local.seed';
import { LocalModels } from './models';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { User_Role } from './models/User_Role.model';
import { DebtRejectStatuses } from './models/DebtRejectStatuses.model';
import LawActRejectStatuses from './models/LawActRejectStatuses.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      models: LocalModels,
      name: 'local',
      logging: false,
    }),
    SequelizeModule.forFeature(
      [User, Role, User_Role, DebtRejectStatuses, LawActRejectStatuses],
      'local',
    ),
  ],
  providers: [LocalSeed],
})
export class LocalDatabase {}
