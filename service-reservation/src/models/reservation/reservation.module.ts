import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { Hotel } from '../hotel/entities/hotel.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './repositories/reservation.repository';
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
    TypeOrmModule.forFeature([ReservationRepository]),
    TypeOrmModule.forFeature([Hotel]),
  ],
  controllers: [ReservationController, UserController],
  providers: [ReservationService, UserService],
})
export class ReservationModule {}
