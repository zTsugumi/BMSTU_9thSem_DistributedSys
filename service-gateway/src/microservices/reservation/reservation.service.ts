import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, lastValueFrom, of } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';
import {
  CreateReservationRequestDTO,
  CreateReservationResponseDTO,
  ReservationResponseDTO,
} from '../../dto/reservation.dto';
import { CircuitBreakerProtected } from '../../circuit-breaker/circuit-breaker';
import { isError } from '../../common/is-error';
import { ServiceUnavailable } from '../../common/constant';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReservationService {
  private readonly loyaltyQueue: Queue;

  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getReservations(userInfo: UserInfoRequestDTO): Promise<ReservationResponseDTO[]> {
    const url = this.appConfig.urlReservations;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.get(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.reservation, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getReservationById(
    userInfo: UserInfoRequestDTO,
    uid: string,
  ): Promise<ReservationResponseDTO> {
    const url = [this.appConfig.urlReservations, uid].join('/');
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.get(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.reservation, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async createReservation(
    userInfo: UserInfoRequestDTO,
    createReservation: CreateReservationRequestDTO,
  ): Promise<CreateReservationResponseDTO> {
    const url = this.appConfig.urlReservations;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.post(url, createReservation, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          // if (!err.response || err.response.status == 503) {
          if (err.response.data)
            throw new HttpException(err.response.data.message, err.response.data.statusCode);
          throw new HttpException(ServiceUnavailable.reservation, 503);
          // }
          // throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async cancelReservationById(userInfo: UserInfoRequestDTO, uid: string): Promise<void> {
    const url = [this.appConfig.urlReservations, uid].join('/');
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.delete(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError(async (err) => {
          if (!err.response) throw new HttpException(ServiceUnavailable.reservation, 503);

          if (err.response.data.message == ServiceUnavailable.loyalty) {
            // await this.loyaltyQueue.add(
            //   'retryFailed',
            //   {
            //     userInfo,
            //     uid,
            //   },
            //   { timeout: 10000, backoff: 3000 },
            // );

            setTimeout(async () => {
              const url = this.appConfig.urlLoyalty;
              await lastValueFrom(this.httpService.delete(url, { headers: headersRequest }));
            }, 20000);

            return of(true);
          } else throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }
}
