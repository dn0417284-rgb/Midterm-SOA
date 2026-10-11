
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép frontend gọi API
  app.enableCors();

  // Kiểm tra dữ liệu gửi từ frontend và Postman
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Sinhvien Service chạy ở cổng 3000
  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(
    `Sinhvien Service đang chạy tại http://localhost:${port}`,
  );
}

bootstrap();
