import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SupportChatModule } from '../support-chat/support-chat.module';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    SupportChatModule,
    FileUploadModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }
