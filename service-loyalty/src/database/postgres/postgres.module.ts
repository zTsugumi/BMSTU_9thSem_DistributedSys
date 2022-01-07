import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../../config/database/postgres/config.module';
import { PostgresConfigService } from '../../config/database/postgres/config.service';
import { AppConfigModule } from 'src/config/app/config.module';
import { AppConfigService } from 'src/config/app/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule, AppConfigModule],
      inject: [PostgresConfigService, AppConfigService],
      useFactory: async (
        postgresConfigService: PostgresConfigService,
        appConfigService: AppConfigService,
      ) => ({
        type: 'postgres' as DatabaseType,
        url: postgresConfigService.url,
        schema: 'loyalties',
        entities: ['dist/models/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        ssl: appConfigService.env === 'production' ? { rejectUnauthorized: false } : false,
      }),
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseModule {}
