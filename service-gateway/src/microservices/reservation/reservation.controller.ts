import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Headers } from '../../decorator/request-header.decorator';
import { ReservationService } from './reservation.service';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';
import {
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
  ReservationResponseDTO,
} from '../../dto/reservation.dto';

@Controller('/reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  public getReservations(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Observable<ReservationResponseDTO[]> {
    return this.reservationService.getReservations(userInfo);
  }

  @Get('/:uid')
  public getReservationById(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Observable<ReservationResponseDTO> {
    return this.reservationService.getReservationById(userInfo, uid);
  }

  @Post()
  public createReservation(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Body() createReservation: CreateReservationRequestDTO,
  ): Observable<CreateReservationResponseDTO> {
    return this.reservationService.createReservation(userInfo, createReservation);
  }

  @Delete('/:uid')
  @HttpCode(204)
  public cancelReservationById(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Observable<void> {
    return this.reservationService.cancelReservationById(userInfo, uid);
  }
}
