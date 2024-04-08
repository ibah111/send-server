import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import https from './utils/https';
import client from './utils/client';
import { contentParser } from 'fastify-multer';
import { LocalSeed } from './Modules/Database/local.database/local.seed';
import moment from 'moment';
import './utils/CustomCA';
import 'colors';

const node = process.env.NODE_ENV;
class bootstrapOptions {
  constructor() {
    this.adapter =
      node === 'prod'
        ? new FastifyAdapter({
            https: https()!,
          })
        : new FastifyAdapter();
  }
  adapter: FastifyAdapter;
}

moment.tz.setDefault('GMT');
async function bootstrap() {
  const options = new bootstrapOptions();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    options.adapter,
  );
  app.register(contentParser);
  try {
    await app.get(LocalSeed).seed();
  } catch (e) {
    console.log(e);
    throw e;
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(client('port'), '0.0.0.0');
  console.log(
    `NODE_ENV: ${node}, Application is running on: ${await app.getUrl()}`.replace(
      'http',
      node === 'prod' ? 'https' : 'http',
    ).yellow,
  );
}

bootstrap();
