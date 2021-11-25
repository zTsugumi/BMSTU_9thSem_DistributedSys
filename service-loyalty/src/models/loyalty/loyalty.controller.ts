import { Body, Controller, Delete, Get, HttpCode, Patch } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { UserInfoRequestDTO } from './dto/userinfo.dto';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from './dto/loyalty.dto';
import { Headers } from '../../decorator/request-header.decorator';

@Controller('/loyalty')
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  @Get()
  public async getLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Promise<LoyaltyResponseDTO> {
    return await this.loyaltyService.getLoyaltyByUsername(userInfo);
  }

  @Patch()
  public async editLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Body() loyalInfo: LoyaltyRequestDTO,
  ): Promise<LoyaltyResponseDTO> {
    return await this.loyaltyService.editLoyaltyByUsername(userInfo, loyalInfo);
  }

  @Delete()
  @HttpCode(204)
  public async reduceLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Promise<void> {
    return await this.loyaltyService.reduceLoyaltyByUsername(userInfo);
  }
}
