import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { tz } from 'moment-timezone';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import https from './utils/https';
import client from './utils/client';
import { contentParser } from 'fastify-multer';
tz.setDefault('GMT');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https }),
  );
  app.register(contentParser);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.listen(client('port'), '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
