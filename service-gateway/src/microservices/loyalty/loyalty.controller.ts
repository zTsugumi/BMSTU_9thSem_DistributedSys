import { Controller, Get, Patch, Body, Delete } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Headers } from '../../decorator/request-header.decorator';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from '../../dto/loyalty.dto';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';
import { LoyaltyService } from './loyalty.service';

@Controller('/loyalty')
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  @Get()
  public getLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Observable<LoyaltyResponseDTO> {
    return this.loyaltyService.getLoyaltyByUsername(userInfo);
  }

  @Patch()
  public editLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
    @Body() loyalInfo: LoyaltyRequestDTO,
  ): Observable<LoyaltyResponseDTO> {
    return this.loyaltyService.editLoyaltyByUsername(userInfo, loyalInfo);
  }

  @Delete()
  public reduceLoyaltyByUsername(
    @Headers(UserInfoRequestDTO) userInfo: UserInfoRequestDTO,
  ): Observable<void> {
    return this.loyaltyService.reduceLoyaltyByUsername(userInfo);
  }
}
