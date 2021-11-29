import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import {
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
  ReservationResponseDTO,
} from './dto/reservation.dto';
import { UserInfoRequestDTO } from './dto/userinfo.dto';
import { ReservationService } from './reservation.service';
import { Headers } from '../../decorator/request-header.decorator';

@Controller('/reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  public async getReservations(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Promise<ReservationResponseDTO[]> {
    return await this.reservationService.getReservations(userInfo);
  }

  @Get('/:uid')
  public async getReservationById(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Promise<ReservationResponseDTO> {
    return await this.reservationService.getReservationById(userInfo, uid);
  }

  @Post()
  public async createReservation(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Body() createReservation: CreateReservationRequestDTO,
  ): Promise<CreateReservationResponseDTO> {
    return await this.reservationService.createReservation(userInfo, createReservation);
  }

  @Delete('/:uid')
  @HttpCode(204)
  public async cancelReservationById(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Promise<void> {
    return await this.reservationService.cancelReservationById(userInfo, uid);
  }
}
