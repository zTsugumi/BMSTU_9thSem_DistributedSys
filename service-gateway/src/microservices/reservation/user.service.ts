import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { AppConfigService } from 'src/config/app/config.service';
import { UserInfoRequestDTO, UserInfoResponseDTO } from '../../dto/userinfo.dto';
import { CircuitBreakerProtected } from '../../circuit-breaker/circuit-breaker';
import { isError } from '../../common/is-error';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getMe(userInfo: UserInfoRequestDTO): Promise<UserInfoResponseDTO> {
    const url = this.appConfig.urlMe;
    const headersRequest = {
      'X-User-Name': userInfo.username,
    };

    return await lastValueFrom(
      this.httpService.get(url, { headers: headersRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException('Reservation service unavailable', 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }
}
