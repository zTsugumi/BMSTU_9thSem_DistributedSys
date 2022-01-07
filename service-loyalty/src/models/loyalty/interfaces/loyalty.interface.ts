import { LoyaltyStatus } from '../../../common/types/loyaltyStatus';

export interface ILoyalty {
  id: number | null;
  username: string | null;
  reservation_count: number | null;
  status: LoyaltyStatus | null;
  discount: number | null;
}
