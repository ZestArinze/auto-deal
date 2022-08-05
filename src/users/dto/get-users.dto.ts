import { IsNumber, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsNumber({}, { each: true })
  @IsOptional()
  userIds?: number[];
}
