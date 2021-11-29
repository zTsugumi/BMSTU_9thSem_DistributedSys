import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { LoyaltyRequestDTO, LoyaltyResponseDTO } from '../../dto/loyalty.dto';
import { UserInfoRequestDTO } from '../../dto/userinfo.dto';
import { CircuitBreakerProtected } from '../../circuit-breaker/circuit-breaker';
import { isError } from '../../common/is-error';
import { ServiceUnavailable } from '../../common/constant';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getLoyaltyByUsername(userInfo: UserInfoRequestDTO): Promise<LoyaltyResponseDTO> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.get(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503) {
            throw new HttpException(ServiceUnavailable.loyalty, 503);
          }
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async editLoyaltyByUsername(
    userInfo: UserInfoRequestDTO,
    loyalInfo: LoyaltyRequestDTO,
  ): Promise<LoyaltyResponseDTO> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.patch(url, loyalInfo, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.loyalty, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }

  // @CircuitBreakerProtected({
  //   shouldErrorBeConsidered: isError,
  // })
  public async reduceLoyaltyByUsername(userInfo: UserInfoRequestDTO): Promise<void> {
    const url = this.appConfig.urlLoyalty;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };
    return await lastValueFrom(
      this.httpService.delete(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.loyalty, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }
}
