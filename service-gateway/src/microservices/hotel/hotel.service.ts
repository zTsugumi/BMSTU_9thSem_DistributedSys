import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { AppConfigService } from '../../config/app/config.service';
import { PaginationRequestDTO, PaginationResponseDTO } from '../../dto/pagination.dto';

@Injectable()
export class HotelService {
  constructor(
    private readonly httpService: HttpService,
    private readonly appConfig: AppConfigService,
  ) {}

  public getHotels(pagination: PaginationRequestDTO): Observable<PaginationResponseDTO> {
    const url = this.appConfig.urlHotels;
    const paramsRequest = {
      page: pagination.page,
      size: pagination.size,
    };

    return this.httpService.get(url, { params: paramsRequest }).pipe(
      map((response) => response.data),
      catchError((err) => {
        throw new HttpException(err.response.data.message, err.response.data.statusCode);
      }),
    );
  }
}
