import { InjectConnection, InjectModel } from '@sql-tools/nestjs-sequelize';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { User_Role } from './models/User_Role.model';
import LawActRejectStatuses from './models/LawActRejectStatuses.model';
import { DebtRejectStatuses } from './models/DebtRejectStatuses.model';

@Injectable()
export class LocalSeed implements OnModuleInit {
  private readonly logger = new Logger(LocalSeed.name);

  private debt_rejected: number[] = [
    115, 103, 104, 106, 110, 112, 6, 111, 119, 118,
  ];
  private law_act_rejected: string[] = ['Отмена приказа'];

  constructor(
    @InjectConnection('local') private sequelize: Sequelize,
    @InjectModel(User, 'local') private readonly modelUser: typeof User,
    @InjectModel(Role, 'local') private readonly modelRole: typeof Role,
    @InjectModel(User_Role, 'local')
    private readonly modelUser_Role: typeof User_Role,
    @InjectModel(LawActRejectStatuses, 'local')
    private readonly modelLawActRejectStatuses: typeof LawActRejectStatuses,
    @InjectModel(DebtRejectStatuses, 'local')
    private readonly modelDebtRejectStatuses: typeof DebtRejectStatuses,
  ) {}
  async onModuleInit() {
    await this.seed();
    await this.seedDebtRejected();
    await this.seedLawActRejected();
  }
  async seed() {
    await this.sequelize.sync();
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
        login: 'balezin@zakon43.ru',
      });
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

  async seedDebtRejected() {
    this.logger.debug('Seeding debt rejected statuses');
    const debt_rejected = await this.modelDebtRejectStatuses.findAll();
    if (debt_rejected.length === 0) {
      for (const reject of this.debt_rejected) {
        await this.modelDebtRejectStatuses.create({ reject_id: reject });
      }
    }
  }

  async seedLawActRejected() {
    this.logger.debug('Seeding law act rejected statuses');
    const law_act_rejected = await this.modelLawActRejectStatuses.findAll();
    if (law_act_rejected.length === 0) {
      for (const reject of this.law_act_rejected) {
        await this.modelLawActRejectStatuses.create({
          reject_name: reject,
        });
      }
    }
  }
}
