import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { addCircuitBreakerTo } from '../../circuit-breaker/circuit-breaker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { Hotel } from '../hotel/entities/hotel.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './repositories/reservation.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Hotel)
class HotelRepository extends Repository<Hotel> {}

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
    TypeOrmModule.forFeature([ReservationRepository]),
    TypeOrmModule.forFeature([HotelRepository]),
  ],
  controllers: [ReservationController, UserController],
  providers: [
    {
      provide: ReservationService,
      useFactory: (
        httpService: HttpService,
        appConfig: AppConfigService,
        reservationRepository: ReservationRepository,
        hotelRepository: HotelRepository,
      ) => {
        return addCircuitBreakerTo(
          new ReservationService(httpService, appConfig, reservationRepository, hotelRepository),
          ReservationService,
        );
      },
      inject: [HttpService, AppConfigService, ReservationRepository, HotelRepository],
    },
    {
      provide: UserService,
      useFactory: (
        httpService: HttpService,
        appConfig: AppConfigService,
        reservationRepository: ReservationRepository,
      ) => {
        return addCircuitBreakerTo(
          new UserService(httpService, appConfig, reservationRepository),
          UserService,
        );
      },
      inject: [HttpService, AppConfigService, ReservationRepository],
    },
  ],
})
export class ReservationModule {}
