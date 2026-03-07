import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const listenPort = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(listenPort);
  console.log(`[Log] Server is running on port ${listenPort}`);
}
void bootstrap();
