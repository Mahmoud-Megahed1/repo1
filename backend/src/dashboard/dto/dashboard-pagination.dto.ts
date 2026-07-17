import { IsOptional, IsString, IsInt, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../user/dto/pagination.dto';

export class DashboardSearchDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(10000)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  query?: string;
}

export class DashboardPaginationDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(10000)
  limit?: number = 10;
}
