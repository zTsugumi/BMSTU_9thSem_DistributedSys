import { Controller, Get, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { PaginationRequestDTO, PaginationResponseDTO } from './dto/pagination.dto';

@Controller('/hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Get()
  public async getHotels(
    @Query() pagination: PaginationRequestDTO,
  ): Promise<PaginationResponseDTO> {
    return await this.hotelService.getHotels(pagination);
  }
}
