import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Expose } from 'class-transformer';
import { ReservationResponseDTO } from './reservation.dto';
import { LoyaltyResponseDTO } from './loyalty.dto';

export class UserInfoRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'x-user-name' })
  username: string;
}

export class UserInfoResponseDTO {
  @IsArray()
  reservations: ReservationResponseDTO[];

  loyalty: LoyaltyResponseDTO;
}
