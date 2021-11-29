import { Controller, Get, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { PaginationRequestDTO, PaginationResponseDTO } from '../../dto/pagination.dto';

@Controller()
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Get('/hotels')
  public async getHotels(
    @Query() pagination: PaginationRequestDTO,
  ): Promise<PaginationResponseDTO> {
    return await this.hotelService.getHotels(pagination);
  }
}
