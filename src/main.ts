import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // فعال‌سازی CORS
  app.enableCors();

  // استفاده از Pipe‌های گلوبال (در صورت نیاز)
  app.useGlobalPipes(/* your validation pipe */);

  // استفاده از Exception Filter گلوبال
  app.useGlobalFilters(new AllExceptionsFilter());

  // استفاده از فایل‌های استاتیک
  app.use('/assets', express.static(join(__dirname, '..', 'assets')));

  // افزایش محدودیت اندازه payload برای JSON
  app.use(bodyParser.json({ limit: '10mb' }));

  // افزایش محدودیت اندازه payload برای فرم‌های urlencoded
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // مستثنی کردن مسیر آپلود فایل‌ها از body-parser
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/upload/instagram_media')) {
      // اگر مسیر آپلود فایل است، اجازه دهید Multer آن را مدیریت کند
      next();
    } else {
      // برای سایر مسیرها، body-parser را اعمال کنید
      next();
    }
  });

  // تنظیمات Swagger
  const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header',
          },
          'access-token',
      )
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // شروع به کار برنامه
  logger.info('Application is starting...');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
