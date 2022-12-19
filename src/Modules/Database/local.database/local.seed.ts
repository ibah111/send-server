import { InjectConnection, InjectModel } from '@contact/nestjs-sequelize';
import { CreationAttributes } from '@contact/sequelize';
import { Sequelize } from '@contact/sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { User_Role } from './models/User_Role.model';

@Injectable()
export class LocalSeed {
  constructor(
    @InjectConnection('local') private sequelize: Sequelize,
    @InjectModel(User, 'local') private readonly modelUser: typeof User,
    @InjectModel(Role, 'local') private readonly modelRole: typeof Role,
    @InjectModel(User_Role, 'local')
    private readonly modelUser_Role: typeof User_Role,
  ) {}
  async sync() {
    await this.sequelize.sync();
  }
  async seed() {
    await this.sync();
    const Roles = await this.modelRole.findAll();
    const roles: CreationAttributes<Role>[] = [
      {
        name: 'admin',
        title: 'Администратор',
      },
    ];
    if (Roles.length === 0) {
      const role_admin = await this.modelRole.create(roles[0]);
      for (let i = 1; i < roles.length; i++)
        await this.modelRole.create(roles[i]);
      const user = await this.modelUser.create({
        login: 'smorkalov@zakon43.ru',
      });
      console.log(user);
      await this.modelUser_Role.create({
        user_id: user.id,
        role_id: role_admin.id,
      });
    } else {
      if (Roles.length !== roles.length) {
        const roled = Roles.map((value) => value.name);
        for (const role of roles) {
          if (!roled.includes(role.name)) await this.modelRole.create(role);
        }
      }
    }
  }
}
