import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { CircuitBreakerProtected } from '../../circuit-breaker/circuit-breaker';
import { AppConfigService } from '../../config/app/config.service';
import {
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
  PaymentResponseDTO,
} from '../../dto/payment.dto';
import { isError } from '../../common/is-error';
import { ServiceUnavailable } from '../../common/constant';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getPaymentById(uid: string): Promise<PaymentResponseDTO> {
    const url = [this.appConfig.urlPayments, uid].join('/');

    return await lastValueFrom(
      this.httpService.get(url).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.payment, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async createPayment(
    createPayment: CreatePaymentRequestDTO,
  ): Promise<CreatePaymentResponseDTO> {
    const url = this.appConfig.urlPayments;

    return await lastValueFrom(
      this.httpService.post(url, createPayment).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.payment, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async cancelPaymentById(uid: string): Promise<void> {
    const url = [this.appConfig.urlPayments, uid].join('/');

    return await lastValueFrom(
      this.httpService.delete(url).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.payment, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }
}
