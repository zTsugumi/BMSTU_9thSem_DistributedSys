import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { AppConfigModule } from './config/app/config.module';
import { AppConfigService } from './config/app/config.service';
import { LoyaltyModule } from './microservices/loyalty/loyalty.module';
import { HotelModule } from './microservices/hotel/hotel.module';
import { PaymentModule } from './microservices/payment/payment.module';
import { ReservationModule } from './microservices/reservation/reservation.module';
import { makeCircuitBreakerStateObserver } from './circuit-breaker/circuit-breaker';

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
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfig: AppConfigService) => ({
        redis: {
          host: appConfig.redisHost,
          port: appConfig.redisPort,
        },
      }),
      inject: [AppConfigService],
    }),
    LoyaltyModule,
    HotelModule,
    PaymentModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {
  constructor(private logger: Logger) {
    const startObservingCircuitBreakerState = makeCircuitBreakerStateObserver(logger);

    // Every 5 seconds CB will be polled and all opened ones get logged with health stats
    startObservingCircuitBreakerState();
  }
}
