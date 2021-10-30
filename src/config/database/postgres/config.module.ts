import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresConfigService } from './config.service';
import configuration from './configuration';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, PostgresConfigService],
  exports: [PostgresConfigService],
})
export class PostgresConfigModule {}
