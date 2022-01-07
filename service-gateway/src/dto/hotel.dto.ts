import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class HotelInfoDTO {
  @IsUUID()
  @IsNotEmpty()
  hotelUid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsNumber()
  @IsOptional()
  stars: number;
}

export class HotelResponseDTO {
  @IsUUID()
  @IsNotEmpty()
  hotelUid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  stars: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
