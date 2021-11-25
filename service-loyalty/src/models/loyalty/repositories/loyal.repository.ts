import { EntityRepository, Repository } from 'typeorm';
import { Loyalty } from '../entities/loyalty.entity';
import { LoyaltyRequestDTO } from '../dto/loyalty.dto';

@EntityRepository(Loyalty)
export class LoyaltyRepository extends Repository<Loyalty> {
  public async editLoyalty(
    loyalty: Loyalty,
    loyaltyRequest: LoyaltyRequestDTO,
  ): Promise<Loyalty> {
    loyalty.status = loyaltyRequest.status;
    loyalty.discount = loyaltyRequest.discount;
    loyalty.reservation_count = loyaltyRequest.reservationCount;

    const newLoyalty = await loyalty.save();
    return newLoyalty;
  }
}
