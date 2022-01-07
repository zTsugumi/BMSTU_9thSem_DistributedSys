import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';
import {
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
  ReservationResponseDTO,
} from '../../dto/reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  public getReservations(userInfo: UserInfoRequestDTO): Observable<ReservationResponseDTO[]> {
    const url = this.appConfig.urlReservations;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.get(url, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public getReservationById(
    userInfo: UserInfoRequestDTO,
    uid: string,
  ): Observable<ReservationResponseDTO> {
    const url = [this.appConfig.urlReservations, uid].join('/');
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.get(url, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public createReservation(
    userInfo: UserInfoRequestDTO,
    createReservation: CreateReservationRequestDTO,
  ): Observable<CreateReservationResponseDTO> {
    const url = this.appConfig.urlReservations;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.post(url, createReservation, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public cancelReservationById(userInfo: UserInfoRequestDTO, uid: string): Observable<void> {
    const url = [this.appConfig.urlReservations, uid].join('/');
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.delete(url, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }
}
