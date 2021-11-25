import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelResponseDTO } from './dto/hotel.dto';
import { PaginationRequestDTO, PaginationResponseDTO } from './dto/pagination.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  public async getHotels(pagination: PaginationRequestDTO): Promise<PaginationResponseDTO> {
    const { page, size } = pagination;

    const [hotels, count] = await this.hotelRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });

    return this.buildPaginationResponse(page, size, count, hotels);
  }

  private buildHotelResponse(hotel: Hotel): HotelResponseDTO {
    const hotelResponseDto = new HotelResponseDTO();
    hotelResponseDto.hotelUid = hotel.hotel_uid;
    hotelResponseDto.name = hotel.name;
    hotelResponseDto.country = hotel.country;
    hotelResponseDto.city = hotel.city;
    hotelResponseDto.address = hotel.address;
    hotelResponseDto.stars = hotel.stars;
    hotelResponseDto.price = hotel.price;

    return hotelResponseDto;
  }

  private buildPaginationResponse(
    page: number,
    size: number,
    count: number,
    items: Hotel[],
  ): PaginationResponseDTO {
    const paginationResponseDto = new PaginationResponseDTO();
    paginationResponseDto.page = Number(page);
    paginationResponseDto.pageSize = Number(size);
    paginationResponseDto.totalElements = count;
    paginationResponseDto.items = items.map((item: Hotel) => this.buildHotelResponse(item));

    return paginationResponseDto;
  }
}
