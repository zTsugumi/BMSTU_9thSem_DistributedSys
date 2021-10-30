import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { APIPrefix } from './common/constant';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(APIPrefix.version);

  const appConfig: AppConfigService = app.get(AppConfigService);
  await app.listen(appConfig.port);
}
bootstrap();
