import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import express from 'express';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return server;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  cachedApp = app;
  return server;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await bootstrap();
  app(req, res);
}
