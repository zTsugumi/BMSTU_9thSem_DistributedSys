import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { addCircuitBreakerTo } from '../../circuit-breaker/circuit-breaker';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

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
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentService,
      useFactory: (httpService: HttpService, appConfig: AppConfigService) => {
        return addCircuitBreakerTo(new PaymentService(httpService, appConfig), PaymentService);
      },
      inject: [HttpService, AppConfigService],
    },
  ],
})
export class PaymentModule {}
