import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SupportChatModule } from '../support-chat/support-chat.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ThemeModule } from '../theme/theme.module';

import { MongooseModule } from '@nestjs/mongoose';
import { LessonReviewChat, LessonReviewChatSchema } from './schemas/lesson-review-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonReviewChat.name, schema: LessonReviewChatSchema }]),
    SupportChatModule,
    FileUploadModule,
    ThemeModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }
