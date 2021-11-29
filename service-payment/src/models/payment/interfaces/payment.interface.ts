import { PaymentStatus } from '../../../common/types/paymentStatus';

export interface IPayment {
  id: number | null;
  payment_uid: string | null;
  status: PaymentStatus | null;
  price: number | null;
}
