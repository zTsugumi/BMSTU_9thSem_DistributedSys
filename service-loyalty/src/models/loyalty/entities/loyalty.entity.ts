import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Check } from 'typeorm';
import { ILoyalty } from '../interfaces/loyalty.interface';
import { LoyaltyStatus } from '../../../common/types/loyaltyStatus';

@Entity({ name: 'loyalty' })
export class Loyalty extends BaseEntity implements ILoyalty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 80 })
  username: string;

  @Column({ nullable: false, default: 0 })
  reservation_count: number;

  @Column({ nullable: false, length: 20, default: 'BRONZE' })
  @Check(`"status" IN ('BRONZE', 'SILVER', 'GOLD')`)
  status: LoyaltyStatus;

  @Column({ nullable: false, default: 0 })
  discount: number;
}
