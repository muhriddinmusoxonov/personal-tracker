import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  // Yuklangan cheklar/skrinshotlarni statik fayl sifatida ochish
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend ishga tushdi: http://localhost:${port}/api`);
}
bootstrap();
