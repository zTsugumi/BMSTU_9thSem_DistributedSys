import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HotelService } from './hotel.service';
import { PaginationRequestDTO, PaginationResponseDTO } from '../../dto/pagination.dto';

@Controller()
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Get('/hotels')
  public getHotels(@Query() pagination: PaginationRequestDTO): Observable<PaginationResponseDTO> {
    return this.hotelService.getHotels(pagination);
  }
}
