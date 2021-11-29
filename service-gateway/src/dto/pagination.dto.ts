import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { HotelResponseDTO } from './hotel.dto';

export class PaginationRequestDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  size: number;
}

export class PaginationResponseDTO {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @IsNumber()
  totalElements: number;

  @IsArray()
  items: HotelResponseDTO[];
}
