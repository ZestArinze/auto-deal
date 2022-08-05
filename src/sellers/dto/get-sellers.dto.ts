import { IsOptional } from 'class-validator';

export class GetSellersDto {
  @IsOptional()
  email?: string;
}
