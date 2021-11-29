import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { APIPrefix } from './common/constant';
import { AppConfigService } from './config/app/config.service';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = await app.get(AppConfigService);

  app.setGlobalPrefix(APIPrefix.version);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.listen(appConfig.port, () => {
    Logger.log(`service-loyalty is listening on ${appConfig.port}...`, 'Main');
  });
}
bootstrap();
