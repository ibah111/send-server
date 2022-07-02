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
tz.setDefault('GMT');
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(client('port'), '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
