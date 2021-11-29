import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsInt, IsOptional, Min, Max } from 'class-validator';
import { HotelResponseDTO } from './hotel.dto';

export class PaginationRequestDTO {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(0)
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  size: number;
}

export class PaginationResponseDTO {
  @IsInt()
  @IsNotEmpty()
  page: number;

  @IsInt()
  @IsNotEmpty()
  pageSize: number;

  @IsInt()
  @IsNotEmpty()
  totalElements: number;

  @IsArray()
  items: HotelResponseDTO[];
}
