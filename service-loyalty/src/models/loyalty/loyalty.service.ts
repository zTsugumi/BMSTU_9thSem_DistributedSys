import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoyaltyRepository } from './repositories/loyal.repository';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from './dto/loyalty.dto';
import { UserInfoRequestDTO } from './dto/userinfo.dto';
import { Loyalty } from './entities/loyalty.entity';
import { LoyaltyStatus } from '../../common/types/loyaltyStatus';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyRepository) private readonly loyaltyRepository: LoyaltyRepository,
  ) {}

  public async getLoyaltyByUsername(userInfo: UserInfoRequestDTO): Promise<LoyaltyResponseDTO> {
    const loyalty = await this.loyaltyRepository.findOne({
      where: {
        username: userInfo.username,
      },
    });

    if (!loyalty) {
      throw new NotFoundException('User not found');
    }

    return this.buildLoyaltyResponse(loyalty);
  }

  public async editLoyaltyByUsername(
    userInfo: UserInfoRequestDTO,
    loyalInfo: LoyaltyRequestDTO,
  ): Promise<LoyaltyResponseDTO> {
    const loyalty = await this.loyaltyRepository.findOne({
      where: {
        username: userInfo.username,
      },
    });

    if (!loyalty) {
      throw new NotFoundException('User not found');
    }

    const newLoyalty = await this.loyaltyRepository.editLoyalty(loyalty, loyalInfo);

    return this.buildLoyaltyResponse(newLoyalty);
  }

  public async reduceLoyaltyByUsername(userInfo: UserInfoRequestDTO): Promise<void> {
    const loyalty = await this.loyaltyRepository.findOne({
      where: {
        username: userInfo.username,
      },
    });

    if (!loyalty) {
      return;
    }

    loyalty.reservation_count -= 1;
    const newCount = loyalty.reservation_count;
    loyalty.status =
      newCount < 10
        ? LoyaltyStatus.BRONZE
        : newCount < 20
        ? LoyaltyStatus.SILVER
        : LoyaltyStatus.GOLD;
    loyalty.discount = newCount < 10 ? 5 : newCount < 20 ? 7 : 10;

    await loyalty.save();
  }

  private buildLoyaltyResponse(loyalty: Loyalty) {
    const loyaltyInfoReponseDto = new LoyaltyResponseDTO();
    loyaltyInfoReponseDto.status = loyalty.status;
    loyaltyInfoReponseDto.discount = loyalty.discount;
    loyaltyInfoReponseDto.reservationCount = loyalty.reservation_count;

    return loyaltyInfoReponseDto;
  }
}
