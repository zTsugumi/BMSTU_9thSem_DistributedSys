import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map, catchError } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { Hotel } from '../hotel/entities/hotel.entity';
import { HotelInfoDTO } from './dto/hotel.dto';
import { LoyaltyResponseDTO } from './dto/loyalty.dto';
import { PaymentResponseDTO } from './dto/payment.dto';
import { ReservationResponseDTO } from './dto/reservation.dto';
import { UserInfoRequestDTO, UserInfoResponseDTO } from './dto/userinfo.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './repositories/reservation.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(ReservationRepository)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  public async getMe(userInfo: UserInfoRequestDTO): Promise<UserInfoResponseDTO> {
    const { username } = userInfo;

    const reservations: Reservation[] = await this.reservationRepository.find({
      where: {
        username: username,
      },
      relations: ['hotel']
    });

    // Query to Loyalty service to get loyalty status
    const urlLoyalty = this.appConfig.urlGateway + '/loyalty';
    const headersRequest = {
      'X-User-Name': username,
    };

    const loyalty: LoyaltyResponseDTO = await lastValueFrom(
      this.httpService.get(urlLoyalty, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );

    const temp = await this.buildUserInfoResponse(reservations, loyalty);
    return temp;
  }

  private buildHotelResponse(hotel: Hotel): HotelInfoDTO {
    const hotelInfo = new HotelInfoDTO();
    hotelInfo.hotelUid = hotel.hotel_uid;
    hotelInfo.name = hotel.name;
    hotelInfo.fullAddress = [hotel.country, hotel.city, hotel.address].join(', ');
    hotelInfo.stars = hotel.stars;

    return hotelInfo;
  }

  private async buildPaymentResponse(payment_uid: string): Promise<PaymentResponseDTO> {
    // Query to Payment service to get payment status
    const urlPayment = [this.appConfig.urlGateway, 'payments', payment_uid].join('/');

    const paymentInfo: PaymentResponseDTO = await lastValueFrom(
      this.httpService.get(urlPayment).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );

    return paymentInfo;
  }

  private async buildReservationResponse(
    reservation: Reservation,
  ): Promise<ReservationResponseDTO> {
    const reservationReponseDto = new ReservationResponseDTO();
    reservationReponseDto.reservationUid = reservation.reservation_uid;
    reservationReponseDto.hotel = this.buildHotelResponse(reservation.hotel);
    reservationReponseDto.startDate = reservation.start_date;
    reservationReponseDto.endDate = reservation.end_date;
    reservationReponseDto.status = reservation.status;
    reservationReponseDto.payment = await this.buildPaymentResponse(reservation.payment_uid);

    return reservationReponseDto;
  }

  private async buildUserInfoResponse(
    reservations: Reservation[],
    loyalty: LoyaltyResponseDTO,
  ): Promise<UserInfoResponseDTO> {
    const userInfoResponse = new UserInfoResponseDTO();

    userInfoResponse.reservations = await Promise.all(
      reservations.map(async (reservation) => await this.buildReservationResponse(reservation)),
    );

    userInfoResponse.loyalty = loyalty;

    return userInfoResponse;
  }
}
