import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_ENV: Joi.string().valid('development', 'production', 'test', 'provision'),
        APP_NAME: Joi.string().default('service-gateway'),
        PORT: Joi.number(),
        HTTP_TIMEOUT: Joi.number(),
        HTTP_MAX_REDIRECTS: Joi.number(),
        URL_LOYALTY: Joi.string(),
        URL_HOTELS: Joi.string(),
        URL_RESERVATIONS: Joi.string(),
        URL_PAYMENTS: Joi.string(),
        URL_ME: Joi.string(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
