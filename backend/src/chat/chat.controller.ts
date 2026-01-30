import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { message: string }) {
    return this.chatService.generateResponse(body.message);
  }
}
