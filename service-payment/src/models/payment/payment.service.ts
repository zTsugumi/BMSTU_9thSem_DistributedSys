import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from '../../common/types/paymentStatus';
import {
  CreatePaymentRequestDTO,
  CreatePaymentResponseDTO,
  PaymentResponseDTO,
} from './dto/payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentRepository) private readonly paymentRepository: PaymentRepository,
  ) {}

  public async getPaymentById(uid: string): Promise<PaymentResponseDTO> {
    const payment = await this.paymentRepository.findOne({
      where: {
        payment_uid: uid,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.buildPaymentResponse(payment);
  }

  public async createPayment(
    createPayment: CreatePaymentRequestDTO,
  ): Promise<CreatePaymentResponseDTO> {
    const payment = await this.paymentRepository.createPayment(createPayment);

    if (!payment) {
      throw new BadRequestException('Payment not created');
    }

    return this.buildCreatePaymentResponse(payment);
  }

  public async cancelPaymentById(uid: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: {
        payment_uid: uid,
      },
    });

    if (!payment) {
      return;
    }

    payment.status = PaymentStatus.CANCELED;

    await payment.save();
  }

  private buildPaymentResponse(payment: Payment): PaymentResponseDTO {
    const paymentReponseDto = new PaymentResponseDTO();
    paymentReponseDto.status = payment.status;
    paymentReponseDto.price = payment.price;

    return paymentReponseDto;
  }

  private buildCreatePaymentResponse(payment: Payment): CreatePaymentResponseDTO {
    const paymentReponseDto = new CreatePaymentResponseDTO();
    paymentReponseDto.status = payment.status;
    paymentReponseDto.price = payment.price;
    paymentReponseDto.paymentUid = payment.payment_uid;

    return paymentReponseDto;
  }
}
