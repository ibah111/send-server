import { Module } from '@nestjs/common';
import { ContactDatabase } from './contact.database';
import { LocalDatabase } from './local.database';

@Module({ imports: [ContactDatabase, LocalDatabase] })
export class DatabaseModule {}
