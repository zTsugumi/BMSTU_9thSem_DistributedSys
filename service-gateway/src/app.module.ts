import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from './config/app/config.module';
import { AppConfigService } from './config/app/config.service';
import { LoyaltyModule } from './microservices/loyalty/loyalty.module';
import { HotelModule } from './microservices/hotel/hotel.module';
import { PaymentModule } from './microservices/payment/payment.module';
import { ReservationModule } from './microservices/reservation/reservation.module';

@Module({
  imports: [
    AppConfigModule,
    HttpModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfig: AppConfigService) => ({
        timeout: appConfig.httpTimeout,
        maxRedirects: appConfig.httpMaxDirect,
      }),
      inject: [AppConfigService],
    }),
    LoyaltyModule,
    HotelModule,
    PaymentModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
