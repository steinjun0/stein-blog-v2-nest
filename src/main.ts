import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const whitelist: Array<string> = ['https://blog.steinjun.net', 'https://test.blog.steinjun.net']
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
  await app.listen(8888);
}
bootstrap();
