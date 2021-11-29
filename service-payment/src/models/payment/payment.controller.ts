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
import {
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
  PaymentResponseDTO,
} from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('/payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/:uid')
  public async getPaymentById(
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Promise<PaymentResponseDTO> {
    return await this.paymentService.getPaymentById(uid);
  }

  @Post()
  public async createPayment(
    @Body() createPayment: CreatePaymentRequestDTO,
  ): Promise<CreatePaymentResponseDTO> {
    return await this.paymentService.createPayment(createPayment);
  }

  @Delete('/:uid')
  @HttpCode(204)
  public async cancelPaymentById(@Param('uid', ParseUUIDPipe) uid: string): Promise<void> {
    return await this.paymentService.cancelPaymentById(uid);
  }
}
