import { HttpModule, HttpService } from '@nestjs/axios';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue } from 'bull';
import { addCircuitBreakerTo } from '../../circuit-breaker/circuit-breaker';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

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
    BullModule.registerQueue({
      name: 'loyalty',
    }),
  ],
  providers: [
    {
      provide: ReservationService,
      useFactory: (httpService: HttpService, appConfig: AppConfigService) => {
        return addCircuitBreakerTo(
          new ReservationService(httpService, appConfig),
          ReservationService,
        );
      },
      inject: [HttpService, AppConfigService],
    },
    {
      provide: UserService,
      useFactory: (httpService: HttpService, appConfig: AppConfigService) => {
        return addCircuitBreakerTo(new UserService(httpService, appConfig), UserService);
      },
      inject: [HttpService, AppConfigService],
    },
  ],
  controllers: [ReservationController, UserController],
})
export class ReservationModule {}
