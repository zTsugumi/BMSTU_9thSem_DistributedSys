import { Expose } from 'class-transformer';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { LoyaltyResponseDTO } from './loyalty.dto';
import { ReservationResponseDTO } from './reservation.dto';

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
