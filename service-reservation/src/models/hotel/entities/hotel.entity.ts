import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, Generated, OneToMany } from 'typeorm';
import { IHotel } from '../interfaces/hotel.interface';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity({ name: 'hotel' })
export class Hotel extends BaseEntity implements IHotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @Generated('uuid')
  hotel_uid: string;

  @Column({ nullable: false, length: 255 })
  name: string;

  @Column({ nullable: false, length: 80 })
  country: string;

  @Column({ nullable: false, length: 80 })
  city: string;

  @Column({ nullable: false, length: 255 })
  address: string;

  @Column()
  stars: number;

  @Column({ nullable: false })
  price: number;

  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.hotel)
  reservations: Reservation[];
}
