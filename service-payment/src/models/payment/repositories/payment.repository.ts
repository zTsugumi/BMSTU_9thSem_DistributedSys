import { EntityRepository, Repository } from 'typeorm';
import { CreatePaymentRequestDTO } from '../dto/payment.dto';
import { Payment } from '../entities/payment.entity';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  public async createPayment(paymentRequest: CreatePaymentRequestDTO): Promise<Payment> {
    const payment = new Payment();
    payment.status = paymentRequest.status;
    payment.price = paymentRequest.price;

    const paymentSaved = await payment.save();

    return paymentSaved;
  }
}
