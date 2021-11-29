import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { addCircuitBreakerTo } from '../../circuit-breaker/circuit-breaker';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';

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
  ],
  controllers: [LoyaltyController],
  providers: [
    {
      provide: LoyaltyService,
      useFactory: (httpService: HttpService, appConfig: AppConfigService) => {
        return addCircuitBreakerTo(new LoyaltyService(httpService, appConfig), LoyaltyService);
      },
      inject: [HttpService, AppConfigService],
    },
  ],
})
export class LoyaltyModule {}
