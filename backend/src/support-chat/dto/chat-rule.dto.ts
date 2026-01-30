import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatRuleDto {
    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @IsString()
    response: string;

    @IsEnum(['exact', 'contains'])
    matchType: 'exact' | 'contains';

    @IsNumber()
    @IsOptional()
    priority?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateChatRuleDto extends CreateChatRuleDto { }
