import { IsArray, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  company_name: string;

  @IsString()
  email: string;

  @IsString()
  address: string;

  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
