import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsNumber()
  mileage: number;

  @IsNumber()
  price: number;

  @IsString()
  year: string;

  @IsString()
  name: string;

  @IsString()
  engine_type: string;

  @IsString()
  transmission: string;

  @IsString()
  fuel_type: string;

  @IsString()
  interior_color: string;

  @IsString()
  exterior_color: string;

  @IsString()
  vehicle_number: string;

  @IsInt()
  brand_id: number;

  @IsInt()
  car_category_id: number;

  @IsInt()
  seller_id: number;
}
