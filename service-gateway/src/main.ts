import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { APIPrefix } from './common/constant';
import { AppConfigService } from './config/app/config.service';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get(AppConfigService);

  app.setGlobalPrefix(APIPrefix.version);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(appConfig.port, () => {
    Logger.log(`service-gateway is listening on ${appConfig.port}...`, 'Main');
  });
}
bootstrap();
