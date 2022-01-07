import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentStatus } from '../../../common/types/paymentStatus';

export class CreatePaymentResponseDTO {
  @IsUUID()
  @IsNotEmpty()
  paymentUid: string;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}

export class PaymentResponseDTO {
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
