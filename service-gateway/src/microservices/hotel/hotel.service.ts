import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, lastValueFrom } from 'rxjs';
import { ServiceUnavailable } from '../../common/constant';
import { isError } from '../../common/is-error';
import { CircuitBreakerProtected } from '../../circuit-breaker/circuit-breaker';
import { AppConfigService } from '../../config/app/config.service';
import { PaginationRequestDTO, PaginationResponseDTO } from '../../dto/pagination.dto';

@Injectable()
export class HotelService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  @CircuitBreakerProtected({
    shouldErrorBeConsidered: isError,
  })
  public async getHotels(pagination: PaginationRequestDTO): Promise<PaginationResponseDTO> {
    const url = this.appConfig.urlHotels;
    const paramsRequest = {
      page: pagination.page,
      size: pagination.size,
    };

    return await lastValueFrom(
      this.httpService.get(url, { params: paramsRequest }).pipe(
        map((response) => response.data),
        catchError((err) => {
          if (!err.response || err.response.status == 503)
            throw new HttpException(ServiceUnavailable.reservation, 503);
          throw new HttpException(err.response.data.message, err.response.data.statusCode);
        }),
      ),
    );
  }
}
