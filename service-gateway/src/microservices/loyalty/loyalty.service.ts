import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from '../../dto/loyalty.dto';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  public getLoyaltyByUsername(userInfo: UserInfoRequestDTO): Observable<LoyaltyResponseDTO> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.get(url, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public editLoyaltyByUsername(
    userInfo: UserInfoRequestDTO,
    loyalInfo: LoyaltyRequestDTO,
  ): Observable<LoyaltyResponseDTO> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.patch(url, loyalInfo, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }

  public reduceLoyaltyByUsername(userInfo: UserInfoRequestDTO): Observable<void> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return this.httpService.delete(url, { headers: headersRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }
}
