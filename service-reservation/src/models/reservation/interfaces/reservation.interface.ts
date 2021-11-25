import { Hotel } from '../../hotel/entities/hotel.entity';

export interface IReservation {
  id: number | null;
  reservation_uid: string | null;
  username: string | null;
  payment_uid: string | null;
  hotel: Hotel | null;
  status: string | null;
  start_date: Date;
  end_date: Date;
}
