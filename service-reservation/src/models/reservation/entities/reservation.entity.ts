import {
  BaseEntity,
  Check,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IReservation } from '../interfaces/reservation.interface';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { ReservationStatus } from '../../../common/types/reservationStatus';

@Entity({ name: 'reservation' })
export class Reservation extends BaseEntity implements IReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @Generated('uuid')
  reservation_uid: string;

  @Column({ nullable: false, length: 80 })
  username: string;

  @Column({ nullable: false })
  @Generated('uuid')
  payment_uid: string;

  @ManyToOne(() => Hotel, (hotel: Hotel) => hotel.id)
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ nullable: false, length: 20 })
  @Check(`"status" IN ('PAID', 'RESERVED', 'CANCELED')`)
  status: ReservationStatus;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;
}
