import { Logger, ValidationPipe } from '@nestjs/common';
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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  getSwaggerOptions,
  getSwaggerOptionsCustom,
} from './utils/getSwaggerOptions';

export const node = process.env.NODE_ENV;
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
  const config = new DocumentBuilder()
    .setTitle('Подача')
    .setDescription('ПО Подача для отдела ИП')
    .addBasicAuth({
      description: 'Введите token в headers',
      name: 'token',
      in: 'header',
      type: 'apiKey',
    })
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
    getSwaggerOptions(),
  );
  SwaggerModule.setup('docs', app, document, getSwaggerOptionsCustom());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const cors_config =
    node === 'dev'
      ? {
          origin: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'token'],
          credentials: true,
        }
      : {};
  console.log('cors_config'.yellow, cors_config);
  app.enableCors(cors_config);
  await app.listen(client('port'), '0.0.0.0');
  console.log(
    `NODE_ENV: ${node}, Send-Application is running on: ${await app.getUrl()}/docs
    `.replace('http', node === 'prod' ? 'https' : 'http').yellow,
  );
}

bootstrap();
