import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { Observable, map, catchError } from 'rxjs';
import { AppConfigService } from 'src/config/app/config.service';
import { UserInfoRequestDTO, UserInfoResponseDTO } from '../../dto/userinfo.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  public getMe(userInfo: UserInfoRequestDTO): Observable<UserInfoResponseDTO> {
    const url = this.appConfig.urlMe;
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
}
