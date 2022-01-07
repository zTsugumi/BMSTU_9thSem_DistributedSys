import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import {
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
  PaymentResponseDTO,
} from '../../dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  public getPaymentById(uid: string): Observable<PaymentResponseDTO> {
    const url = [this.appConfig.urlPayments, uid].join('/');

    return this.httpService.get(url).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public createPayment(
    createPayment: CreatePaymentRequestDTO,
  ): Observable<CreatePaymentResponseDTO> {
    const url = this.appConfig.urlPayments;

    return this.httpService.post(url, createPayment).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public cancelPaymentById(uid: string): Observable<void> {
    const url = [this.appConfig.urlPayments, uid].join('/');

    return this.httpService.delete(url).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }
}
