import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { addCircuitBreakerTo } from '../../circuit-breaker/circuit-breaker';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

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
  controllers: [HotelController],
  providers: [
    {
      provide: HotelService,
      useFactory: (httpService: HttpService, appConfig: AppConfigService) => {
        return addCircuitBreakerTo(new HotelService(httpService, appConfig), HotelService);
      },
      inject: [HttpService, AppConfigService],
    },
  ],
})
export class HotelModule {}
