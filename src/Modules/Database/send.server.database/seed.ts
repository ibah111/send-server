import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@sql-tools/nestjs-sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { join } from 'path';
import createUmzug from '../umzug';
@Injectable()
export class LocalServerDatabaseSeed implements OnModuleInit {
  constructor(
    @InjectConnection('send') private readonly sequelize: Sequelize,
    @InjectConnection('contact') private readonly sequelizeContact: Sequelize,
  ) {}
  onModuleInit() {
    return this.sync();
  }
  async sync() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'migrations'),
      'MigrationMeta',
    );

    try {
      await this.sequelizeContact.authenticate();
      await this.sequelize.authenticate();
      await umzug.up();
      await this.seed();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async seed() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'seeds'),
      'SeedMeta',
    );
    await umzug.up();
  }
}
