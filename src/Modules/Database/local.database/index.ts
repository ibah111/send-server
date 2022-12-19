import { SequelizeModule } from '@contact/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { LocalSeed } from './local.seed';
import { LocalModels } from './models';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { User_Role } from './models/User_Role.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      models: LocalModels,
      name: 'local',
      logging: false,
    }),
    SequelizeModule.forFeature([User, Role, User_Role], 'local'),
  ],
  providers: [LocalSeed],
})
export class LocalDatabase {}
