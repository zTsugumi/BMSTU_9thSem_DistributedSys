import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { LoyaltyStatus } from '../../../common/types/loyaltyStatus';

export class LoyaltyResponseDTO {
  @IsEnum(LoyaltyStatus)
  @IsNotEmpty()
  status: LoyaltyStatus;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  reservationCount: number;
}
