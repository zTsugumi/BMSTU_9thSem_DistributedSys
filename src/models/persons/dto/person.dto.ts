import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PersonRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  work: string;
}

export class PersonResponseDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  address: string;

  @IsString()
  work: string;
}
