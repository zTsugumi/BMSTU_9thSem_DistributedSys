import { IsUUID, IsNumber, IsEnum, IsNotEmpty, IsISO8601 } from 'class-validator';
import { ReservationStatus } from '../common/types/reservationStatus';
import { PaymentResponseDTO, CreatePaymentResponseDTO } from './payment.dto';
import { HotelInfoDTO } from './hotel.dto';

export class CreateReservationRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  hotelUid: string;

  @IsISO8601()
  @IsNotEmpty()
  startDate: Date;

  @IsISO8601()
  @IsNotEmpty()
  endDate: Date;
}

export class CreateReservationResponseDTO {
  @IsUUID()
  @IsNotEmpty()
  reservationUid: string;

  @IsUUID()
  @IsNotEmpty()
  hotelUid: string;

  @IsISO8601()
  @IsNotEmpty()
  startDate: Date;

  @IsISO8601()
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @IsNotEmpty()
  payment: CreatePaymentResponseDTO;
}

export class ReservationResponseDTO {
  @IsUUID()
  @IsNotEmpty()
  reservationUid: string;

  @IsNotEmpty()
  hotel: HotelInfoDTO;

  @IsISO8601()
  @IsNotEmpty()
  startDate: Date;

  @IsISO8601()
  @IsNotEmpty()
  endDate: Date;

  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @IsNotEmpty()
  payment: PaymentResponseDTO;
}
