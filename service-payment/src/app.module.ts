import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresDatabaseModule } from './database/postgres/postgres.module';
import { PaymentModule } from './models/payment/payment.module';

@Module({
  imports: [AppConfigModule, PostgresDatabaseModule, PaymentModule],
})
export class AppModule {}
