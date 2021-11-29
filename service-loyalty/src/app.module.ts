import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresDatabaseModule } from './database/postgres/postgres.module';
import { LoyaltyModule } from './models/loyalty/loyalty.module';

@Module({
  imports: [AppConfigModule, PostgresDatabaseModule, LoyaltyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
