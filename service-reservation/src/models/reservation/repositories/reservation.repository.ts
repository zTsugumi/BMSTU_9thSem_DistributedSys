import { ReservationStatus } from '../../../common/types/reservationStatus';
import { EntityRepository, Repository } from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { CreatePaymentResponseDTO } from '../dto/payment.dto';
import { CreateReservationRequestDTO } from '../dto/reservation.dto';
import { UserInfoRequestDTO } from '../dto/userinfo.dto';
import { Reservation } from '../entities/reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  public async createReservation(
    userInfo: UserInfoRequestDTO,
    hotel: Hotel,
    paymentInfo: CreatePaymentResponseDTO,
    reservationInfo: CreateReservationRequestDTO,
  ): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.username = userInfo.username;
    reservation.payment_uid = paymentInfo.paymentUid;
    reservation.hotel = hotel;
    reservation.status = ReservationStatus.PAID;
    reservation.start_date = reservationInfo.startDate;
    reservation.end_date = reservationInfo.endDate;

    const reservationSaved = await reservation.save();

    return reservationSaved;
  }
}
