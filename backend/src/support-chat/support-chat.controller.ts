import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { SupportChatService } from './support-chat.service';
import { CurrentUser } from '../user-auth/decorator/get-curr-user.decorator';
import { User } from '../user/models/user.schema';
import { UserJwtGuard } from '../user-auth/guards';
import { IsString, MaxLength, MinLength } from 'class-validator';

class SendMessageDto {
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content: string;
}

@Controller('support-chat')
@UseGuards(UserJwtGuard)
export class SupportChatController {
    constructor(private readonly chatService: SupportChatService) { }

    @Get('history')
    async getHistory(@CurrentUser() user: User) {
        return this.chatService.getHistory(user);
    }

    @Post('send')
    async sendMessage(
        @CurrentUser() user: User,
        @Body(ValidationPipe) dto: SendMessageDto,
    ) {
        return this.chatService.processUserMessage(user, dto.content);
    }
}
