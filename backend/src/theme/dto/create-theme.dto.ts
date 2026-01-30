import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateThemeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  assets?: {
    backgroundImage?: string;
    logo?: string;
  };

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}
