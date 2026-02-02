import { IsEnum, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Level_Name, LESSONS } from '../../common/shared/enums';

export class SpeakCompareTranscriptsDto {

  @Type(() => String)
  @IsEnum(Level_Name)
  level_name: Level_Name

  @Type(() => String)
  @IsString()
  sentenceText: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  day: number;

  @Type(() => String)
  @IsEnum(LESSONS)
  @IsOptional()
  lesson_name?: LESSONS;
}