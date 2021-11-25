import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, map, lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { ReservationRepository } from './repositories/reservation.repository';
import { Reservation } from './entities/reservation.entity';
import { Hotel } from '../hotel/entities/hotel.entity';
import { AppConfigService } from '../../config/app/config.service';
import { PaymentStatus } from '../../common/types/paymentStatus';
import { LoyaltyStatus } from '../../common/types/loyaltyStatus';
import { LoyaltyResponseDTO } from './dto/loyalty.dto';
import { HotelInfoDTO } from './dto/hotel.dto';
import { PaymentResponseDTO, CreatePaymentResponseDTO } from './dto/payment.dto';
import {
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
  ReservationResponseDTO,
} from './dto/reservation.dto';
import { UserInfoRequestDTO } from './dto/userinfo.dto';
import { ReservationStatus } from '../../common/types/reservationStatus';

@Injectable()
export class ReservationService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(ReservationRepository)
    private readonly reservationRepository: ReservationRepository,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  public async getReservations(userInfo: UserInfoRequestDTO): Promise<ReservationResponseDTO[]> {
    const { username } = userInfo;

    const reservations = await this.reservationRepository.find({
      where: {
        username: username,
      },
      relations: ['hotel'],
    });

    return await Promise.all(
      reservations.map(async (reservation) => await this.buildReservationResponse(reservation)),
    );
  }

  public async getReservationById(
    userInfo: UserInfoRequestDTO,
    uid: string,
  ): Promise<ReservationResponseDTO> {
    const { username } = userInfo;

    const reservation = await this.reservationRepository.findOne({
      where: {
        username: username,
        reservation_uid: uid,
      },
      relations: ['hotel'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return await this.buildReservationResponse(reservation);
  }

  public async createReservation(
    userInfo: UserInfoRequestDTO,
    createReservation: CreateReservationRequestDTO,
  ): Promise<CreateReservationResponseDTO> {
    const { username } = userInfo;
    const { hotelUid, startDate, endDate } = createReservation;

    // Check if hotelUid is valid
    const hotel: Hotel = await this.hotelRepository.findOne({
      where: {
        hotel_uid: hotelUid,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

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

    // Count number of reservation nights + discount
    const nMilSecs = new Date(endDate).getTime() - new Date(startDate).getTime();
    const nDays = nMilSecs / (1000 * 60 * 60 * 24);
    const nDiscount = loyalty.discount;

    // Calculate total cost for nDays
    const totalCost = (nDays * hotel.price * (100 - nDiscount)) / 100;

    // Query to Payment service to create new record
    const urlPayment = this.appConfig.urlGateway + '/payments';
    const newPayment = {
      status: PaymentStatus.PAID,
      price: totalCost,
    };

    const payment: CreatePaymentResponseDTO = await lastValueFrom(
      this.httpService.post(urlPayment, newPayment).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );

    // Query to Loyalty service to increase count reservation
    const newReservationCount = loyalty.reservationCount + 1;
    const newLoyalty = {
      status:
        newReservationCount < 10
          ? LoyaltyStatus.BRONZE
          : newReservationCount < 20
          ? LoyaltyStatus.SILVER
          : LoyaltyStatus.GOLD,
      discount: newReservationCount < 10 ? 5 : newReservationCount < 20 ? 7 : 10,
      reservationCount: newReservationCount,
    };

    const savedLoyalty = await lastValueFrom(
      this.httpService.patch(urlLoyalty, newLoyalty, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );

    if (JSON.stringify(savedLoyalty) !== JSON.stringify(newLoyalty))
      throw new InternalServerErrorException('Loyalty not updated');

    // Save the reservation to DB
    const reservation = await this.reservationRepository.createReservation(
      userInfo,
      hotel,
      payment,
      createReservation,
    );

    if (!reservation) {
      throw new BadRequestException('Reservation not created');
    }

    return this.buildCreateReservationResponse(reservation, nDiscount, payment);
  }

  public async cancelReservationById(userInfo: UserInfoRequestDTO, uid: string): Promise<void> {
    const { username } = userInfo;

    const reservation: Reservation = await this.reservationRepository.findOne({
      where: {
        username: username,
        reservation_uid: uid,
      },
    });

    if (!reservation || reservation.status == ReservationStatus.CANCELED) {
      return;
    }

    // Change reservation status to canceled
    reservation.status = ReservationStatus.CANCELED;
    await reservation.save();

    // Query to Payment service to change payment status to canceled
    const urlPayment = [this.appConfig.urlGateway, 'payments', reservation.payment_uid].join('/');

    await lastValueFrom(
      this.httpService.delete(urlPayment).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );

    // Query to Loyalty service to reduce loyalty status
    const urlLoyalty = this.appConfig.urlGateway + '/loyalty';
    const headersRequest = {
      'X-User-Name': username,
    };

    await lastValueFrom(
      this.httpService.delete(urlLoyalty, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
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

  private buildCreateReservationResponse(
    reservation: Reservation,
    discount: number,
    payment: CreatePaymentResponseDTO,
  ): CreateReservationResponseDTO {
    const reservationReponseDto = new CreateReservationResponseDTO();
    reservationReponseDto.reservationUid = reservation.reservation_uid;
    reservationReponseDto.hotelUid = reservation.hotel.hotel_uid;
    reservationReponseDto.startDate = reservation.start_date;
    reservationReponseDto.endDate = reservation.end_date;
    reservationReponseDto.discount = discount;
    reservationReponseDto.status = reservation.status;
    reservationReponseDto.payment = new PaymentResponseDTO();
    reservationReponseDto.payment.price = payment.price;
    reservationReponseDto.payment.status = payment.status;

    return reservationReponseDto;
  }
}
