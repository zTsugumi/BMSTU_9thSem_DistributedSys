import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Check, Generated } from 'typeorm';
import { IPayment } from '../interfaces/payment.interface';
import { PaymentStatus } from '../../../common/types/paymentStatus';

@Entity({ name: 'payment' })
export class Payment extends BaseEntity implements IPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @Generated('uuid')
  payment_uid: string;

  @Column({ nullable: false, length: 20 })
  @Check(`"status" IN ('PAID', 'REVERSED', 'CANCELED')`)
  status: PaymentStatus;

  @Column({ nullable: false })
  price: number;
}
