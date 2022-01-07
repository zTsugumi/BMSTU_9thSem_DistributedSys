import { Controller, Get, Param, Post, Body, ParseUUIDPipe, Delete } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
  PaymentResponseDTO,
} from '../../dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/:uid')
  public getPaymentById(@Param('uid', ParseUUIDPipe) uid: string): Observable<PaymentResponseDTO> {
    return this.paymentService.getPaymentById(uid);
  }

  @Post()
  public createPayment(
    @Body() createPayment: CreatePaymentRequestDTO,
  ): Observable<CreatePaymentResponseDTO> {
    return this.paymentService.createPayment(createPayment);
  }

  @Delete('/:uid')
  public cancelPaymentById(
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Observable<void> {
    return this.paymentService.cancelPaymentById(uid);
  }
}
