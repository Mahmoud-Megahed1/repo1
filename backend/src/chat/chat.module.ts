import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SupportChatModule } from '../support-chat/support-chat.module';

@Module({
  imports: [
    SupportChatModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }
