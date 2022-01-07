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
