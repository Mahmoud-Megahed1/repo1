import { IsArray, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(100, { each: true })
  repurchaseDiscounts?: number[];

  @IsOptional()
  testsAvailability?: Record<string, boolean>;
}
