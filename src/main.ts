import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { SocketAppModule } from './socketApp.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const whitelist: Array<string> = ['https://blog.steinjun.net', 'https://test.blog.steinjun.net', 'http://dev-next']
  if (process.env.NODE_ENV === 'development')
    whitelist.push('http://localhost:3000')
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(8888);

  const socektApp = await NestFactory.create(SocketAppModule);
  socektApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  if (process.env.NODE_ENV === 'development')
    whitelist.push('http://localhost:3000')
  socektApp.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  });
  socektApp.use(json({ limit: '50mb' }));
  socektApp.use(urlencoded({ extended: true, limit: '50mb' }));
  await socektApp.listen(8889);
}
bootstrap();
