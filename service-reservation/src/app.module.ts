import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresDatabaseModule } from './database/postgres/postgres.module';
import { HotelModule } from './models/hotel/hotel.module';
import { ReservationModule } from './models/reservation/reservation.module';

@Module({
  imports: [AppConfigModule, PostgresDatabaseModule, HotelModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
