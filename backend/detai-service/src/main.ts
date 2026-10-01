import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  const port = parseInt(process.env.PORT || '3002', 10);
  await app.listen(port);
}
await bootstrap();
