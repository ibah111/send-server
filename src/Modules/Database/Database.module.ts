import { Module } from '@nestjs/common';
import { ContactDatabase } from './contact.database';
import { LocalDatabase } from './local.database';
import { LocalServerDatabase } from './send.server.database';

@Module({ imports: [ContactDatabase, LocalDatabase, LocalServerDatabase] })
export class DatabaseModule {}
